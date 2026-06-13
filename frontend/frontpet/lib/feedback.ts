import NotificationMessage from "@/components/common/actionbutton/notification/notficationmessage";

export function notifySuccess(description: string, title = "Success") {
  NotificationMessage.success({ message: title, description });
}

export function notifyError(description: string, title = "Error") {
  NotificationMessage.error({ message: title, description });
}

export function notifyInfo(description: string, title = "Info") {
  NotificationMessage.info({ message: title, description });
}

export function extractApiError(
  err: unknown,
  fallback = "Something went wrong",
): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  if (typeof msg === "string" && msg.trim()) return msg;
  return fallback;
}

const INVALID_CREDENTIALS =
  "Invalid email or password. Please check your credentials and try again.";

export function formatLoginError(err: unknown): string {
  const raw = extractApiError(err, "");
  const normalized = raw.toLowerCase();

  if (
    normalized.includes("invalid credentials") ||
    normalized.includes("invalid email or password") ||
    normalized.includes("user not found")
  ) {
    return INVALID_CREDENTIALS;
  }

  if (
    normalized.includes("service provider") ||
    normalized.includes("pet owner")
  ) {
    return raw;
  }

  if (normalized.includes("inactive or deleted")) {
    return "This account is inactive or has been deleted.";
  }

  const axiosErr = err as { message?: string; response?: unknown };
  if (!axiosErr.response && axiosErr.message?.includes("Network Error")) {
    return "Could not reach the server. Check your connection and try again.";
  }

  if (raw) return raw;
  return "Sign in failed. Please try again.";
}

export type LoginRoleHint = "OWNER" | "PROVIDER";

export function getLoginRoleHint(error: string): LoginRoleHint | null {
  if (error.includes("registered as a service provider")) return "PROVIDER";
  if (error.includes("registered as a pet owner")) return "OWNER";
  return null;
}

export function formatRegisterError(err: unknown): string {
  const raw = extractApiError(err, "");
  const normalized = raw.toLowerCase();

  if (
    normalized.includes("duplicate") ||
    normalized.includes("unique constraint") ||
    normalized.includes("already exists")
  ) {
    return "An account with this email already exists. Sign in or use a different email.";
  }

  if (normalized.includes("must be an email") || normalized.includes("email must")) {
    return "Please enter a valid email address.";
  }

  if (normalized.includes("password") && normalized.includes("6")) {
    return "Password must be at least 6 characters.";
  }

  const axiosErr = err as { message?: string; response?: unknown };
  if (!axiosErr.response && axiosErr.message?.includes("Network Error")) {
    return "Could not reach the server. Check your connection and try again.";
  }

  if (raw) return raw;
  const status = (err as { response?: { status?: number } })?.response?.status;
  if (status === 500) {
    return "Registration failed due to a server error. If you already have an account, try signing in.";
  }
  return "Registration failed. Please try again.";
}
