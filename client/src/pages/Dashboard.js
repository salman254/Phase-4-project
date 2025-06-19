import React, { useEffect, useState } from "react";
import { getMyStartups, getMyInvestments } from "../api";

const Dashboard = () => {
  const [startups, setStartups] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    Promise.all([getMyStartups(token), getMyInvestments(token)])
      .then(([startupsData, investmentsData]) => {
        setStartups(startupsData);
        setInvestments(investmentsData);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>My Dashboard</h2>
      {error && <p className="text-danger">{error}</p>}
      <div>
        <h4>My Startups</h4>
        <ul>
          {startups.map((s) => (
            <li key={s.id}>{s.name} - {s.category}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>My Investments</h4>
        <ul>
          {investments.map((inv) => (
            <li key={inv.id}>${inv.amount} in {inv.startup_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
