import { NextRequest, NextResponse } from "next/server";
import { registerUser as registerUserService } from "@/services/authService";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await registerUserService(email, password);

    return NextResponse.json(
      {
        user: { id: user.id, email: user.email },
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (err: any) {
    // User already exists returns 409, other errors are 500
    if (err.message.includes("exists")) {
      return NextResponse.json({ message: err.message }, { status: 409 });
    }

    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
