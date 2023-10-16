import { connectedDb } from "@/helper/db";
import User from "@/models/user";
import { NextResponse } from "next/server"

connectedDb()

export async function GET(request) {
    const url = request.url ? request.url : ''

    console.log(url)
    // if (!url) {
    //     return NextResponse.json({
    //         message: 'Request URL is missing !!',
    //         success: false
    //     });
    // }

    // const searchParams = url.searchParams;
    // console.log(searchParams)
    // const search = searchParams.get('search');

    // if (!search) {
    //     return NextResponse.json({
    //         message: 'Search parameter is missing !!',
    //         success: false
    //     });
    // }

    // try {
    //     const users = await User.find({
    //         $or: [
    //             { name: { $regex: search, $options: "i" } },
    //             { email: { $regex: search, $options: "i" } },
    //         ]
    //     }).select('-password');

    //     return NextResponse.json(users, {
    //         status: 201
    //     });
    // } catch (error) {
    //     console.log(error);
    //     return NextResponse.json({
    //         message: 'Failed to retrieve users !!',
    //         success: false
    //     });
    // }
}