import mongoose from "mongoose";

let Message;

try {
  Message = mongoose.model("Message");
} catch (error) {
  const messageSchema = new mongoose.Schema(
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    },
    {
      timestamps: true,
    }
  );
  Message = mongoose.model("Message", messageSchema);
}

export default Message;
