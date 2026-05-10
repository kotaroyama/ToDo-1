import { getToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log(API_BASE_URL);

export async function apiFetch(path, options = {}) {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
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