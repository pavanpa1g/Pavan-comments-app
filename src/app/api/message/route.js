import { connectedDb } from "@/helper/db";
import Chat from "@/models/chat";
import Message from "@/models/message";
import User from "@/models/user";
import { NextResponse } from "next/server";

connectedDb();

export function GET() {}

export async function POST(request) {
  const { content, chatId, currentUserId } = await request.json();
  if (!content || !chatId || !currentUserId) {
    return NextResponse.json({ message: "Invalid data passed to request" });
  }

  try {
    const newMessage = {
      sender: currentUserId,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.log("Error creating a message", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export function PUT() {}

export function DELETE() {}
