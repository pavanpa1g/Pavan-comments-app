import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user";

export async function GET(request) {

    const data = jwt.verify(request.cookies.get('jwt_token').value, process.env.JWT_SECRET)

    try {
        // const id = ObjectId(data.id)
        const user = await User.findById(data.id)
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }


}
