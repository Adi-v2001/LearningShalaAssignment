import prisma from "@/Lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {title, description, articleType, imageUrl, userId} = body
    if(!title || !description || !articleType || !imageUrl || !userId){
      return NextResponse.json({statusText: 'Data missing'}, {status: 400})
    }

    const article = await prisma.article.create({
        data: {
            user: {
                connect: {
                    id: userId
                }
            },
            title,
            description,
            category: articleType,
            image: imageUrl
        }
    })

    return NextResponse.json({statusText: 'Article created successfully', article}, {status: 200})
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { statusText: "Internal Server Error" },
      { status: 500 }
    );
  }
}
