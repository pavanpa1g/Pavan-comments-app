import { connectedDb } from "@/helper/db";
import Image from "@/models/image";
import User from "@/models/user";
import { NextResponse } from "next/server";

connectedDb();

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const user = await User.findById({ _id: id })
        if (!user) {
            return NextResponse.json({ message: 'user not found !!', success: false }, { status: 400 })
        }
        const images = await Image.find()
            .where("postedBy")
            .equals(`${id}`)
            .populate("postedBy", "-password")
            .populate("likedBy", "-password");

        return NextResponse.json(images, { status: 201 });
    } catch (error) {
        console.log({ error });
        return NextResponse.json(
            { message: "Failed to retrieve posts" },
            { status: 500 }
        );
    }
}

