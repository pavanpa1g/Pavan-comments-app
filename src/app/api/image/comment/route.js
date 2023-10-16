import { connectedDb } from "@/helper/db";
import Comment from "@/models/comment";
import Image from "@/models/image";
import User from "@/models/user";
import { getUserIdByToken } from "@/utils/getUserIdByToken";
import { NextResponse } from "next/server";

connectedDb();

export async function POST(request) {
  const { imageId, comment } = await request.json();

  const id = getUserIdByToken(request.cookies?.get("jwt_token").value);

  if (!imageId || !comment) {
    return NextResponse.json(
      { message: "please provide all the fields" },
      { status: 401 }
    );
  }

  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 403 });
    }

    const newComment = {
      commentedBy: id,
      comment: comment,
      commentedOn: image._id,
    };

    const fullComment = await Comment.create(newComment);

    await Image.findByIdAndUpdate(imageId, {
      $inc: { commentsCount: 1 },
    });

    return NextResponse.json(
      {
        message: "commented successfully",
        fullComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in posting a comment", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}
