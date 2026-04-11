import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

function buildOutputFileName(originalName: string, extension: string) {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "image";
  return `${baseName}${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "File is required." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files can be normalized." },
        { status: 400 },
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(inputBuffer, { failOn: "none" }).rotate();
    const metadata = await image.metadata();

    const outputMimeType = metadata.hasAlpha ? "image/png" : "image/jpeg";
    const outputBuffer = metadata.hasAlpha
      ? await image.png({ compressionLevel: 9 }).toBuffer()
      : await image.jpeg({ quality: 95, mozjpeg: true }).toBuffer();
    const outputFileName = buildOutputFileName(
      file.name || "image",
      metadata.hasAlpha ? ".png" : ".jpg",
    );

    return new NextResponse(outputBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": outputMimeType,
        "Cache-Control": "no-store",
        "X-File-Name": outputFileName,
      },
    });
  } catch (error) {
    console.error("normalize-image error", error);
    return NextResponse.json(
      { message: "Không thể chuyển đổi ảnh trước khi tải lên." },
      { status: 500 },
    );
  }
}
