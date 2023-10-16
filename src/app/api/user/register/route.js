import { connectedDb } from "@/helper/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

connectedDb();

export async function POST(request) {
    const { name, email, password, picture } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json({
            message: "Please Enter all the required fields",
            success: false,
        }, { status: 400 });
    }

    const nweUser = new User({
        name,
        email,
        password,
        picture,
    });

    try {

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 })
        }


        const createdUser = await nweUser.save();

        const responseUser = {
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            picture: createdUser.picture,
        }

        const response = NextResponse.json(responseUser, {
            status: 201,
        });

        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "failed to create user !!",
            success: false,
        });
    }
}