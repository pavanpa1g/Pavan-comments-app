import mongoose from "mongoose";

let Comment;

try {
  Comment = mongoose.model("Comment");
} catch (error) {
  const commentSchema = mongoose.Schema(
    {
      commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      commentedOn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
      comment: { type: String, required: true, trim: true },
    },
    {
      timestamps: true,
    }
  );

  Comment = mongoose.model("Comment", commentSchema);
}

export default Comment;
