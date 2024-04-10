import prisma from "@/Lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId')
        if(!userId){
            return NextResponse.json({statusText: 'User id missing'}, {status: 400})
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        return NextResponse.json({statusText: 'User found successfully', user}, {status: 200})
    } catch (err) {
        return NextResponse.json({statusText: 'An error occured', err}, {status: 500})
    }
}