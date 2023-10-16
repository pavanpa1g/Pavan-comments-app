import { connectedDb } from "@/helper/db";
import Message from "@/models/message";
import { NextResponse } from "next/server";

connectedDb();

export async function GET(request, { params }) {
  const { chatId } = params;
  console.log(chatId);
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name picture email")
      .populate("chat");

    return NextResponse.json(messages, { status: 201 });
  } catch (error) {
    console.log("Error fetching messages", error);
    return NextResponse.json({ error: error.message });
  }
}
