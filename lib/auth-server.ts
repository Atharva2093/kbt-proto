import admin from "./firebase-admin";

/**
 * Extracts the ID token from the Authorization header and verifies it.
 * @param req The incoming Request object
 * @returns The decoded ID token
 */
export async function verifyToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) throw new Error("No token provided");

  return await admin.auth().verifyIdToken(token);
}
