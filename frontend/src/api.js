import { getToken } from "./auth";

export async function apiFetch(path, options = {}) {
    const token = getToken();

    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,  
      }
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }
    return response.json();
}