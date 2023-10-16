import User from "@/models/user";
import { NextResponse } from "next/server";

import jwt from "jsonwebtoken"
import { connectedDb } from "@/helper/db";

connectedDb();


export async function GET() {
    return NextResponse.json({
        message: "working",
    });
}

export async function POST(request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json(
            { message: "Enter Email and Password" },
            { status: 400 }
        );
    }

    try {
        const user = await User.findOne({ email });

        if (user && user?.password === password) {

            //Login Successp
            return NextResponse.json(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    token: generateToken(user._id),
                },
                { status: 201 }
            );
        } else {
            //Failed Login
            return NextResponse.json(
                { message: "Invalid Email or Password" },
                { status: 403 }
            );
        }
    } catch (error) {
        console.log("Error in login", error)
        return NextResponse.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}





const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}

