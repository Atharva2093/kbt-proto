import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect 
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

/**
 * Signs in a user with Google using a hybrid popup/redirect approach.
 * senior-engineer fix: Added verbose logging and robust fallback.
 */
export async function loginWithGoogle() {
  try {
    console.log("[AUTH] Starting Google login with Popup...");
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.error("[AUTH] Google login Popup failed. Code:", error.code, "Message:", error.message);
    
    // Fallback to redirect if popup is blocked or fails
    console.log("[AUTH] Falling back to Redirect strategy...");
    return await signInWithRedirect(auth, googleProvider);
  }
}

/**
 * Signs in a user with email and password using Firebase Auth.
 * @param email The user's email
 * @param password The user's password
 * @returns The user credential object
 */
export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Creates a new user with email and password using Firebase Auth.
 * @param email The user's email
 * @param password The user's password
 * @returns The user credential object
 */
export async function signup(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Syncs the authenticated Firebase user with the backend database.
 * Mandatory Step before allowing app access.
 */
export async function syncUser(user: any) {
  const token = await user.getIdToken();
  console.log("[AUTH_SYNC] Sending token to backend...");

  const res = await fetch("/api/auth/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[AUTH_SYNC] Sync failed:", err);
    throw new Error("SYNC_FAILED");
  }

  const data = await res.json();
  console.log("[AUTH_SYNC] Sync success:", data);
  return data;
}

/**
 * Signs out the current user.
 */
export async function logout() {
  return await signOut(auth);
}
