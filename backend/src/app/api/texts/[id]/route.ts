// src/app/api/texts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/requireAuth";
import {
  getTextByIdForUser,
  deleteTextForUser,
} from "@/services/textService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  try {
    const { id } = params;
    const text = await getTextByIdForUser(id, userId);
    if (!text) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ text }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  try {
    const { id } = params;
    const deleted = await deleteTextForUser(id, userId);
    if (!deleted) return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
