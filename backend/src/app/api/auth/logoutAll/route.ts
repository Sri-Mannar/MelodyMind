import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/requireAuth";
import { logoutAllSessions } from "@/services/authService";

export async function POST(req: NextRequest) {
  // First, check authentication
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult; // Unauthorized

  const { userId } = authResult;

  try {
    await logoutAllSessions(userId);

    return NextResponse.json(
      { message: "All sessions logged out successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
