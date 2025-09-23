import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/requireAuth";
import { logoutUser } from "@/services/authService";

export async function POST(req: NextRequest) {
  // First, check authentication
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult; // Unauthorized

  const { userId } = authResult;

  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json(
        { message: "refreshToken is required" },
        { status: 400 }
      );
    }

    await logoutUser(userId, refreshToken);

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
