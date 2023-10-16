import { NextResponse } from "next/server";
import { connectedDb } from "@/helper/db";
import User from "@/models/user";
import { getUserIdByToken } from "@/utils/getUserIdByToken";
// import { getUserIdByToken } from "@/utils/getUserIdByToken";

connectedDb();

export async function GET(request) {
  const id = getUserIdByToken(request.cookies?.get("jwt_token").value);

  try {
    const users = await User.find({ _id: { $ne: id } }).select("-password");

    return NextResponse.json(users, {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "failed to retrieve users !!",
      success: false,
    });
  }
}

export async function POST(request) {
  const { name, email, password, picture } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      {
        message: "Please Enter all the required fields",
        success: false,
      },
      { status: 400 }
    );
  }

  const nweUser = new User({
    name,
    email,
    password,
    picture,
  });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const createdUser = await nweUser.save();

    const responseUser = {
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      picture: createdUser.picture,
    };

    const response = NextResponse.json(responseUser, {
      status: 201,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "failed to create user !!",
      success: false,
    });
  }
}

export function PUT() {}

export function DELETE() {}
