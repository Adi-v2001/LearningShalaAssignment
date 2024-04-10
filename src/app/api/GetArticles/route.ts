import prisma from "@/Lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const pageSize  = 10

export async function GET(request: NextRequest) {
    try {
        const pageNumber = Number(request.nextUrl.searchParams.get('pageNumber'))
        const search = request.nextUrl.searchParams.get('search')
        const category = request.nextUrl.searchParams.get('category') ? request.nextUrl.searchParams.get('category') : null
        const author = request.nextUrl.searchParams.get('author') ? request.nextUrl.searchParams.get('author') : null

        const articles = await prisma.article.findMany({
            orderBy: {
                publishedAt: 'desc'
            },
            include: {
                user: true
            },
            where: {
                title: {
                    contains: search ? search : '',
                    mode: 'insensitive'
                },
                ...(category !== null && { category }),
                ...(author !== null && { user: {name: author} })
            },
            skip: (pageNumber - 1)*pageSize,
            take: pageSize + 1
        })

        const hasMore = articles.length > pageSize;
        
        if (hasMore) {
            articles.pop();
        }

        return NextResponse.json({statusText: 'Articles found successfully', articles, hasMore}, {status: 200})

    } catch (err) {
        console.log('An error occured while api call', err)
        return NextResponse.json({statusText: 'An error occured while api call', err}, {status: 500})
    }
}