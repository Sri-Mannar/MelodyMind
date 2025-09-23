import { NextRequest, NextResponse } from "next/server";
import { loginUser as loginUserService } from "@/services/authService";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await loginUserService(email, password);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    // Invalid credentials
    if (err.message.includes("Invalid") || err.message.includes("exists")) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
