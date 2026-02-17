/**
 * API client for the Draftly backend.
 *
 * Backend uses Clerk authentication (Bearer token from Clerk session).
 * Base URL comes from NEXT_PUBLIC_API_URL env var.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";

// --- Types ---

export interface User {
    _id: string;
    clerkId: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Subscription {
    _id: string;
    name: string;
    price: number;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    category: "entertainment" | "education" | "productivity" | "health" | "other";
    paymentMethod: "credit_card" | "debit_card" | "UPI" | "bank_transfer" | "other";
    status: "active" | "expired" | "canceled" | "paused";
    startDate: string;
    renewalDate: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// --- Fetch helper with Clerk authentication ---

async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
    token?: string | null
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || `API error: ${res.status}`);
    }

    return res.json();
}

// --- Users ---

export async function syncUser(token?: string | null) {
    return apiFetch<ApiResponse<User>>("/api/v1/users/sync", {
        method: "POST"
    }, token);
}

// --- Subscriptions ---

export async function getUserSubscriptions(userId: string, token?: string | null) {
    return apiFetch<ApiResponse<Subscription[]>>(
        `/api/v1/subscriptions/user/${userId}`,
        {},
        token
    );
}

export async function createSubscription(
    data: Omit<Subscription, "_id" | "user" | "createdAt" | "updatedAt" | "status">,
    token?: string | null
) {
    return apiFetch<ApiResponse<Subscription>>(
        "/api/v1/subscriptions",
        { method: "POST", body: JSON.stringify(data) },
        token
    );
}

export async function updateSubscription(
    id: string,
    data: Partial<Omit<Subscription, "_id" | "user" | "createdAt" | "updatedAt">>,
    token?: string | null
) {
    return apiFetch<ApiResponse<Subscription>>(
        `/api/v1/subscriptions/${id}`,
        { method: "PUT", body: JSON.stringify(data) },
        token
    );
}

export async function cancelSubscription(id: string, token?: string | null) {
    return apiFetch<ApiResponse<Subscription>>(
        `/api/v1/subscriptions/${id}/cancel`,
        { method: "PUT" },
        token
    );
}

export async function deleteSubscription(id: string, token?: string | null) {
    return apiFetch<ApiResponse<null>>(
        `/api/v1/subscriptions/${id}`,
        { method: "DELETE" },
        token
    );
}

export async function getUpcomingRenewals(days = 7, token?: string | null) {
    return apiFetch<ApiResponse<Subscription[]>>(
        `/api/v1/subscriptions/upcoming-renewals?days=${days}`,
        {},
        token
    );
}
