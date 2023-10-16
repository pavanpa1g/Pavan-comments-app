import { connectedDb } from "@/helper/db";
import Chat from "@/models/chat";
import User from "@/models/user";
import { getUserIdByToken } from "@/utils/getUserIdByToken";
import { NextResponse } from "next/server";

connectedDb();

export async function POST(request) {
  const { users, name } = await request.json();

  const token = request.cookies?.get("jwt_token");

  const id = getUserIdByToken(token?.value);
  console.log(id);

  if (!users || !name) {
    return NextResponse.json(
      { message: "Please Fill all the fields" },
      { status: 400 }
    );
  }

  let usersArray = JSON.parse(users);

  if (usersArray.length < 2) {
    return NextResponse.json(
      { message: "At least two people are required to create a group." },
      { status: 400 }
    );
  }

  const currentUser = await User.findById({ _id: id }).select("-password");

  if (!currentUser) {
    return NextResponse.json(
      { message: "Please logout and login again", success: false },
      { status: 400 }
    );
  }

  usersArray.push(currentUser);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: usersArray,
      isGroupChat: true,
      groupAdmin: id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return NextResponse.json(fullGroupChat, { status: 201 });
  } catch (error) {
    console.log("err", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
