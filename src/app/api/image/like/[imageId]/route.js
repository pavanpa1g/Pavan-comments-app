import { connectedDb } from "@/helper/db";
import Image from "@/models/image";
import { getUserIdByToken } from "@/utils/getUserIdByToken";
import { NextResponse } from "next/server";

connectedDb();

export async function PUT(request, { params }) {
  const { imageId } = params;
  console.log("imageId", imageId);

  const id = getUserIdByToken(request.cookies?.get("jwt_token").value);

  try {
    const image = await Image.findById(imageId);

    if (!image) {
      return NextResponse.json({ message: "Image Not Found" }, { status: 404 });
    }

    let updatedLikes;

    if (image.likedBy.includes(id)) {
      // If user has already liked the post, remove like
      updatedLikes = await Image.findByIdAndUpdate(
        imageId,
        {
          $pull: { likedBy: id },
          $inc: { likes: -1 },
        },
        { new: true }
      )
        .populate("postedBy", "-password")
        .populate("likedBy", "-password");
    } else {
      // If user has not liked the post, add like
      updatedLikes = await Image.findByIdAndUpdate(
        imageId,
        {
          $addToSet: { likedBy: id },
          $inc: { likes: 1 },
        },
        { new: true }
      )
        .populate("postedBy", "-password")
        .populate("likedBy", "-password");
    }

    return NextResponse.json(updatedLikes, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
