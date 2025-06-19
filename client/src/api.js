const API_BASE = "http://localhost:5000"; // or http://localhost:5050 if you change port

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
};

export const register = (data) =>
  fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  }).then(handleResponse);

export const login = (data) =>
  fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  }).then(handleResponse);

export const getProfile = (token) =>
  fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  }).then(handleResponse);

export const getMyStartups = (token) =>
  fetch(`${API_BASE}/startups/mine`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  }).then(handleResponse);

export const createStartup = (token, data) =>
  fetch(`${API_BASE}/startups/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  }).then(handleResponse);

export const updateStartup = (token, id, data) =>
  fetch(`${API_BASE}/startups/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  }).then(handleResponse);

export const deleteStartup = (token, id) =>
  fetch(`${API_BASE}/startups/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  }).then(handleResponse);

export const invest = (token, startupId, amount) =>
  fetch(`${API_BASE}/investments/invest/${startupId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
    credentials: "include",
  }).then(handleResponse);

export const getMyInvestments = (token) =>
  fetch(`${API_BASE}/investments/my-investments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  }).then(handleResponse);
