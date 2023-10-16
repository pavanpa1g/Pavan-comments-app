import { connectedDb } from "@/helper/db";
import Chat from "@/models/chat";
import User from "@/models/user";
import Message from "@/models/message";
import { getUserIdByToken } from "@/utils/getUserIdByToken";
import { NextResponse } from "next/server";

connectedDb();

export async function GET(request) {
  try {
    const id = getUserIdByToken(request.cookies.get("jwt_token").value);

    const user = await User.findById({ _id: id });

    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }

    console.log("reached");

    let results = await Chat.find({
      users: { $elemMatch: { $eq: id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name picture email",
    });

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.log("err", error);
    return NextResponse.json(
      { message: "Unauthorized", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { userId, currentUserId } = await request.json();

  console.log(userId, currentUserId);

  try {
    // console.log(request.cookies.get('jwt_token').value)
    // const id = getUserIdByToken(request.cookies.get('jwt_token').value);
    // console.log("user id", id)

    if (!userId) {
      return NextResponse.json(
        { message: "Please provide userId" },
        { status: 401 }
      );
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name picture email",
    });

    if (isChat.length > 0) {
      return NextResponse.json({ data: isChat[0] }, { status: 201 });
    } else {
      const chatData = {
        isGroupChat: false,
        users: [currentUserId, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);

        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );

        return NextResponse.json(FullChat, { status: 201 });
      } catch (error) {
        console.log("err", error);

        return NextResponse.json(
          { message: "Internal Server Error", error },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.log("err", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}

export function PUT() {}

export function DELETE() {}
