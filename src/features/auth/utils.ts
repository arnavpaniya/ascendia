import type { AppUserRole } from "@/features/auth/types";
import { AUTH_REDIRECTS } from "@/features/auth/constants";

export function getRedirectPathForRole(role: AppUserRole = "student") {
  return AUTH_REDIRECTS[role] ?? AUTH_REDIRECTS.student;
}

export function getReadableAuthError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "That email is already in use.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/weak-password":
        return "Use a password with at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled before completion.";
      case "auth/popup-blocked":
        return "Your browser blocked the Google sign-in popup.";
      case "auth/network-request-failed":
        return "Firebase could not reach the auth service. Check your internet connection, disable VPN/ad blockers for this site, and confirm your app domain is allowed in Firebase Authentication.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again in a few minutes.";
      default:
        break;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
