import admin from "firebase-admin";
import prisma from "./db";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function verifyAuth(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const firebaseUid = decoded.uid;

    // Find or create the user in Prisma
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      // Small safety net: if user exists in Firebase but not in DB yet (e.g. sync failed)
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email: decoded.email!,
          name: decoded.name || null,
          imageUrl: decoded.picture || null,
        },
      });
    }

    return { user, firebaseUid };
  } catch (err: any) {
    console.error("[AUTH_VERIFY_ERROR]", err.message);
    throw new Error("Unauthorized");
  }
}
