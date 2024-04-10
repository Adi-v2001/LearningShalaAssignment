import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import prisma from "@/Lib/prisma";
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {email, password} = body

    if(!email || !password) {
      return NextResponse.json({statusText: 'Email or password missing'}, {status: 401})
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!user){
        return NextResponse.json({statusText: 'No user found'}, {status: 401})
    }

    const isCorrectPassword = await bcrypt.compare(password, user?.password)

    if(isCorrectPassword){
        const token = jwt.sign({
            name: user.name,
            email: user.email
        }, String(process.env.SECRET_KEY));
        return NextResponse.json({statusText: 'Authentication successful', token, user: user}, {status: 200})
    } else {
        return NextResponse.json({statusText: 'Incorrect password'}, {status: 401})
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { statusText: "Internal Server Error" },
      { status: 500 }
    );
  }
}
