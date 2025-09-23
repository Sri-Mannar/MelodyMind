import { NextRequest, NextResponse } from "next/server";
import { refreshTokens } from "@/services/authService";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "refreshToken is required" },
        { status: 400 }
      );
    }

    const result = await refreshTokens(refreshToken);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    // Invalid or expired refresh token
    if (err.message.includes("Invalid") || err.message.includes("expired") || err.message.includes("Session")) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
