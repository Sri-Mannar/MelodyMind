import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/requireAuth";
import { getAudioById, deleteAudio } from "@/services/audioService";

// GET /api/audios/:id -> fetch single audio
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { userId } = authResult;

  try {
    const audio = await getAudioById(userId, params.id);
    if (!audio) {
      return NextResponse.json({ message: "Audio not found" }, { status: 404 });
    }
    return NextResponse.json(audio, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE /api/audios/:id -> delete audio
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { userId } = authResult;

  try {
    const result = await deleteAudio(userId, params.id);

    if (result.count === 0) {
      return NextResponse.json({ message: "Audio not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Audio deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
