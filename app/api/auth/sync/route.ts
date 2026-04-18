export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email!,
        // We can add name update here if we have decoded.name
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email!,
        // name: decoded.name, // Based on user snippet, name might be available
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[SYNC_ERROR]", err);
    return NextResponse.json({ error: "Unauthorized", details: err.message }, { status: 401 });
  }
}
