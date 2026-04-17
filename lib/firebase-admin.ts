import admin from "firebase-admin";

if (!admin.apps.length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // 1. Remove potential leading/trailing quotes
    privateKey = privateKey.trim().replace(/^["']|["']$/g, '');
    
    // 2. Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    console.log("[FIREBASE_ADMIN] Initializing with key length:", privateKey.length);
    if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
      console.error("[FIREBASE_ADMIN] Warning: Private key does not start with expected header!");
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

export default admin;
