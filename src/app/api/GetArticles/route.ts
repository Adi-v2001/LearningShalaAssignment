import prisma from "@/Lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

        const articles = await prisma.article.findMany({})

        return NextResponse.json({statusText: 'Articles found successfully', articles}, {status: 200})

    } catch (err) {
        console.log('An error occured while api call', err)
        return NextResponse.json({statusText: 'An error occured while api call', err}, {status: 500})
    }
}