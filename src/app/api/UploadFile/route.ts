import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { statusText: "No file found" },
        { status: 400 }
      );
    }

    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const newFileName = `${Date.now()}-${file.name}`

    const path = `./public/uploads/${newFileName}`;

    await writeFile(path, buffer);

    return NextResponse.json(
      { statusText: "File uploaded successfully", path: `/uploads/${newFileName}` },
      { status: 200 }
    );
  } catch (err) {
    console.log('An error occured', err)
    return NextResponse.json(
      { statusText: "Internal server error" },
      { status: 500 }
    );
  }
}
