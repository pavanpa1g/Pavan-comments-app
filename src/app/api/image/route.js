import { connectedDb } from "@/helper/db";
import Image from "@/models/image";
import User from "@/models/user";
import { getUserIdByToken } from "@/utils/getUserIdByToken";
import { NextResponse } from "next/server";

connectedDb();

export async function GET(request) {
  try {
    const allImages = await Image.find()
      .populate("postedBy", "-password")
      .populate("likedBy", "-password");

    return NextResponse.json(allImages, { status: 201 });
  } catch (error) {
    console.log("Error while fetching the Images ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { imageUrl, description } = await request.json();

  const id = getUserIdByToken(request.cookies?.get("jwt_token").value);

  if (!imageUrl) {
    return NextResponse.json(
      { message: "Please provide imageUrl" },
      { status: 401 }
    );
  }

  try {
    const newImage = {
      imageUrl,
      postedBy: id,
      likes: 0,
      likedBY: [],
      commentsCount: 0,
      description,
    };
    const imagePosted = await Image.create(newImage);

    const FullImagePost = await Image.findOne({
      _id: imagePosted._id,
    }).populate("postedBy", "-password");

    return NextResponse.json(FullImagePost, { status: 201 });
  } catch (error) {
    console.log("Error in uploading the images ", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export function PUT() {}

export function DELETE() {}
