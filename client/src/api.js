const API_BASE = "http://localhost:5000";

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
};

export const register = (data, isMultipart = false) =>
  fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: isMultipart ? undefined : { "Content-Type": "application/json" },
    body: isMultipart ? data : JSON.stringify(data),
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

export const getAllStartups = () =>
  fetch(`${API_BASE}/startups/`, {
    method: "GET",
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

export const updateInvestment = (token, investmentId, amount) =>
  fetch(`${API_BASE}/investments/edit/${investmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
    credentials: "include",
  }).then(handleResponse);

export const deleteInvestment = (token, investmentId) =>
  fetch(`${API_BASE}/investments/delete/${investmentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
