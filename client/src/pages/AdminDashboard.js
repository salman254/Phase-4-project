import React, { useEffect, useState } from "react";
import { getProfile } from "../api";

const AdminDashboard = () => {
  const [data, setData] = useState({ startups: [], users: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    getProfile(token)
      .then((user) => {
        if (!user.is_admin) {
          setError("Access denied.");
        } else {
          fetch("http://localhost:5000/users/admin/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then(setData)
            .catch((err) => setError("Failed to load dashboard."));
        }
      })
      .catch(() => setError("Unauthorized"));
  }, []);

  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h4>All Startups</h4>
      <ul>
        {data.startups.map((s) => (
          <li key={s.id}>
            {s.name} ({s.category}) - ${s.current_funding} / ${s.funding_goal} by {s.owner}
          </li>
        ))}
      </ul>

      <h4>All Users</h4>
      <ul>
        {data.users.map((u) => (
          <li key={u.id}>
            {u.username} - {u.email} {u.is_admin ? "(Admin)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
