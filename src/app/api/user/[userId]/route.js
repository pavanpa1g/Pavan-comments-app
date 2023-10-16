import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { userId } = params;

    try {
        const user = await User.findById({ _id: userId }).select("-password");

        if (!user) {
            return NextResponse.json(
                { message: "user not found", success: false },
                { status: 401 }
            );
        }

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.log("error", error.message);

        return NextResponse.json({ message: "failed to retrieve user data !!" });
    }
}

export async function DELETE(request, { params }) {
    const { userId } = params;

    try {
        const user = await User.findById({ _id: userId });
        if (!user) {
            return NextResponse.json(
                { message: "User Not Found!!", success: false },
                { status: 401 }
            );
        }
        await User.deleteOne({ _id: userId });

        return NextResponse.json({
            message: "user deleted !!",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({
            message: "Error in deleting user !!",
            success: false,
        });
    }
}

export async function PUT(request, { params }) {
    const { userId } = params;

    const { name, password, picture } = await request.json();

    try {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 400 });
        }

        if (name) user.name = name;
        if (password) user.password = password;
        if (picture) user.picture = picture;

        const updatedUser = await user.save();

        const responseUser = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            picture: updatedUser.picture,
        }

        return NextResponse.json(responseUser);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed To update the user info", success: false },
            { status: 500 }
        );
    }
}
