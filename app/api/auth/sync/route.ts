import { verifyToken } from "@/lib/auth-server";
import prisma from "@/lib/db"; // Assuming lib/db.ts is the prisma client singleton
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("[API_AUTH_SYNC] Starting sync request...");
    const decoded = await verifyToken(req);
    console.log(`[API_AUTH_SYNC] Token verified for UID: ${decoded.uid}`);

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email!,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email!,
      },
    });

    console.log(`[API_AUTH_SYNC] DB Sync Success: ${user.id}`);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error(`[API_ERROR_AUTH_SYNC] ${error.message} - ${error.stack}`);
    return NextResponse.json({ error: "Unauthorized", details: error.message }, { status: 401 });
  }
}
