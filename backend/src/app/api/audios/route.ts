import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/requireAuth";
import { createAudio, getUserAudios } from "@/services/audioService";

// POST /api/audios -> create audio record
export async function POST(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult; // unauthorized

  const { userId } = authResult;

  try {
    const { title, url, durationS } = await req.json();

    if (!title || !url || !durationS) {
      return NextResponse.json(
        { message: "title, url, and durationS are required" },
        { status: 400 }
      );
    }

    const audio = await createAudio(userId, title, url, durationS);

    return NextResponse.json(audio, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// GET /api/audios -> list user audios
export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { userId } = authResult;

  try {
    const audios = await getUserAudios(userId);
    return NextResponse.json(audios, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
