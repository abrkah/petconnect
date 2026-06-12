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
