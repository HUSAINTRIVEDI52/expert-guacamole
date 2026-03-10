"use server";

import { apiClient } from "@/lib/apiClient";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const data = await apiClient.post("/auth/login", { email, password });
    await setAuthCookies(data.access_token, data.refresh_token);
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Login failed" };
  }

  redirect("/dashboard"); // Redirect to a protected route after success
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Note: we can also collect first/last name if the backend model is updated to support them,
  // but for now, we'll follow the Phase 3 backend implementation which primarily uses email/password.

  try {
    const data = await apiClient.post("/auth/register", { email, password });
    await setAuthCookies(data.access_token, data.refresh_token);
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Signup failed" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/login");
}

export async function googleAuthAction(idToken: string) {
  try {
    const data = await apiClient.post("/auth/google", { id_token: idToken });
    await setAuthCookies(data.access_token, data.refresh_token);
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Google authentication failed",
    };
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  try {
    await apiClient.post("/auth/forgot-password", { email });
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to send reset link",
    };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  try {
    await apiClient.post("/auth/reset-password", { token, password });
    return { success: true };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}
