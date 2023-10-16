import Comment from "@/models/comment";
import Image from "@/models/image";
import { getUserIdByToken } from "@/utils/getUserIdByToken";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function DELETE(request, { params }) {
  const { commentId } = params;

  const id = getUserIdByToken(request.cookies?.get("jwt_token").value);

  if (!commentId) {
    return NextResponse.json(
      { message: "please provide a commentID" },
      { status: 401 }
    );
  }

  try {
    const comment = await Comment.findById(commentId).populate("commentedOn");

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    if (
      comment.commentedBy.toString() === id.toString() ||
      comment.commentedOn.postedBy.toString() === id.toString()
    ) {
      const imageId = comment.commentedOn;
      await Comment.findByIdAndDelete(commentId);

      await Image.findByIdAndUpdate(imageId, {
        $inc: { commentsCount: -1 },
      });

      return NextResponse.json(
        { message: "Comment deleted successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "You are unauthorized to delete this post" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 503 }
    );
  }
}
