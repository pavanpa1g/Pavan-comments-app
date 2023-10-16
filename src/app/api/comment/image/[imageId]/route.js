import { connectedDb } from "@/helper/db";
import Comment from "@/models/comment";
import Image from "@/models/image";
import { NextResponse } from "next/server";

connectedDb();

export async function GET(request, { params }) {
  const { imageId } = params;

  console.log(imageId);

  if (!imageId) {
    return NextResponse.json(
      { message: "Please provide an image id" },
      { status: 401 }
    );
  }

  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json(
        { message: `no such image found` },
        { status: 404 }
      );
    }

    const comments = await Comment.find()
      .where("commentedOn")
      .equals(`${imageId}`)
      .populate("commentedBy", "-password")
      .populate("commentedOn");

    return NextResponse.json(comments, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error in fetching the data" },
      { status: 500 }
    );
  }
}
