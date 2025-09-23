// src/middleware/requireAuth.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthHeader } from "./auth";

export function requireAuth(req: NextRequest) {
  const user = getUserFromAuthHeader(req as any); // Adapted for NextRequest
  if (!user) {
    // Return a response instead of throwing
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return user; // { userId: string }
}
