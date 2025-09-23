import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/utils/bcryptHelpers";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/jwtHelpers";
import { hashToken } from "@/utils/tokenHelpers";

// ----------------- REGISTER -----------------
export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return user;
}

// ----------------- LOGIN -----------------
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken({ userId: user.id });
  const refreshToken = generateRefreshToken({ userId: user.id });

  // Calculate expiration for refresh token (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Store hashed refresh token in DB
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashToken(refreshToken),
      expiresAt,
    },
  });

  return { accessToken, refreshToken, user };
}

// ----------------- REFRESH TOKENS -----------------
export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) throw new Error("Invalid refresh token");

  const session = await prisma.session.findFirst({
    where: { refreshToken: hashToken(refreshToken), userId: payload.userId },
  });

  if (!session) throw new Error("Session not found");

  //  Expiry check: ensure session hasn't expired
  if (session.expiresAt < new Date()) throw new Error("Session expired");


  // Calculate new expiration
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  const newAccessToken = generateAccessToken({ userId: payload.userId });
  const newRefreshToken = generateRefreshToken({ userId: payload.userId });

  // Update stored session with new hashed token and new expiry
  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: hashToken(newRefreshToken),
      expiresAt: newExpiresAt,
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// ----------------- LOGOUT -----------------
export async function logoutUser(userId: string, refreshToken: string) {
  await prisma.session.deleteMany({
    where: {
      userId,
      refreshToken: hashToken(refreshToken),
    },
  });
}
// ----------------- LOGOUT ALL SESSIONS -----------------
export async function logoutAllSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId },
  });
}