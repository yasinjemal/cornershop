// ============================================
// File Upload API — POST upload media files
// ============================================
// Handles image and video uploads for products
// Stores files in public/uploads/ with unique names

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles: { url: string; type: "image" | "video"; name: string }[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        errors.push(`${file.name}: Unsupported file type (${file.type})`);
        continue;
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        const maxMB = maxSize / (1024 * 1024);
        errors.push(`${file.name}: File too large (max ${maxMB}MB)`);
        continue;
      }

      // Generate unique filename
      const ext = file.name.split(".").pop() || "bin";
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .substring(0, 50);
      const uniqueName = `${safeName}-${timestamp}-${random}.${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      uploadedFiles.push({
        url: `/uploads/${uniqueName}`,
        type: isImage ? "image" : "video",
        name: file.name,
      });
    }

    if (uploadedFiles.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join("; ") },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      ...(errors.length > 0 && { warnings: errors }),
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
