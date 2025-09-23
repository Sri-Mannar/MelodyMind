import type { NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/utils/jwtHelpers";

// Extend request to include userId for API Routes
export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
}

// Middleware to get userId from Authorization header
export function getUserFromAuthHeader(
  req: NextApiRequest | NextRequest
): { userId: string } | null {
  try {
    let authHeader: string | null | undefined;

    if ("headers" in req) {
      // NextRequest (App Router) uses Headers object
      if (typeof (req.headers as Headers).get === "function") {
        authHeader = (req.headers as Headers).get("authorization");
      } else {
        // NextApiRequest (API Routes) uses IncomingHttpHeaders
        authHeader = (req.headers as Record<string, string | undefined>).authorization;
      }
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);
    if (!payload || !payload.userId) return null;

    return { userId: payload.userId };
  } catch {
    return null;
  }
}
