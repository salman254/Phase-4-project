import React, { useEffect, useState } from "react";
import { getProfile } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      const res = await getProfile(token);
      setUser(res);
    };
    load();
  }, [token]);

  return user ? (
    <div>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Admin:</strong> {user.is_admin ? "Yes" : "No"}</p>
    </div>
  ) : <p>Loading...</p>;
}
