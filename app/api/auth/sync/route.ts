import { NextResponse } from "next/server";
import admin from "firebase-admin";
import prisma from "@/lib/db";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

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
