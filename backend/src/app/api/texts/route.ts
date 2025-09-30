// src/app/api/texts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/requireAuth";
import {
  createText,
  getUserTexts,
} from "@/services/textService";

const MAX_CONTENT_LENGTH = 20000; // adjust if needed

export async function POST(req: NextRequest) {
  // auth
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  try {
    const body = await req.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!content) {
      return NextResponse.json({ message: "content is required" }, { status: 400 });
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json({ message: "content too long" }, { status: 413 });
    }

    const text = await createText(userId, title, content);

    return NextResponse.json(
      { id: text.id, message: "Text uploaded successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  try {
    const texts = await getUserTexts(userId);
    return NextResponse.json({ texts }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
