export type HireRequestRow = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message?: string | null;
  responseMessage?: string | null;
  decidedByRole?: string | null;
  petIds?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
  provider: { id: string; fullName: string };
};

export type HireStatus = "PENDING" | "APPROVED";

export type HireFeedback = {
  status: "REJECTED";
  responseMessage?: string | null;
};

export const hireStatusColor: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export function buildHireStatusMap(
  requests: HireRequestRow[],
): Map<string, HireStatus> {
  const map = new Map<string, HireStatus>();
  for (const request of requests) {
    const providerId = request.provider.id;
    if (request.status === "APPROVED") {
      map.set(providerId, "APPROVED");
    } else if (
      request.status === "PENDING" &&
      map.get(providerId) !== "APPROVED"
    ) {
      map.set(providerId, "PENDING");
    }
  }
  return map;
}

export function buildHireFeedbackMap(
  requests: HireRequestRow[],
): Map<string, HireFeedback> {
  const latestByProvider = new Map<string, HireRequestRow>();
  for (const request of requests) {
    const providerId = request.provider.id;
    if (!latestByProvider.has(providerId)) {
      latestByProvider.set(providerId, request);
    }
  }

  const map = new Map<string, HireFeedback>();
  for (const [providerId, request] of latestByProvider) {
    if (
      request.status === "REJECTED" &&
      request.decidedByRole === "PROVIDER"
    ) {
      map.set(providerId, {
        status: "REJECTED",
        responseMessage: request.responseMessage,
      });
    }
  }
  return map;
}
