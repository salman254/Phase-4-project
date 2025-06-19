// client/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  getMyStartups,
  getMyInvestments,
  createStartup,
  invest,
} from "../api";

export default function Dashboard({ user }) {
  const [startups, setStartups] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    funding_goal: ""
  });
  const [investForm, setInvestForm] = useState({
    startup_id: "",
    amount: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const myStartups = await getMyStartups(token);
    const myInvestments = await getMyInvestments(token);
    setStartups(myStartups);
    setInvestments(myInvestments);
  };

  const handleStartupSubmit = async (e) => {
    e.preventDefault();
    await createStartup(token, form);
    setForm({ name: "", category: "", funding_goal: "" });
    loadData();
  };

  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    await invest(token, investForm.startup_id, parseFloat(investForm.amount));
    setInvestForm({ startup_id: "", amount: "" });
    loadData();
  };

  return (
    <div>
      <h2>My Dashboard</h2>

      <h4>Create a Startup</h4>
      <form onSubmit={handleStartupSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Funding Goal"
          type="number"
          value={form.funding_goal}
          onChange={(e) => setForm({ ...form, funding_goal: e.target.value })}
          required
        />
        <button className="btn btn-primary mb-4">Create Startup</button>
      </form>

      <h4>My Startups</h4>
      {startups.length === 0 ? (
        <p>You haven't created any startups yet.</p>
      ) : (
        <ul className="list-group mb-4">
          {startups.map((s) => (
            <li key={s.id} className="list-group-item">
              {s.name} - {s.category} | Goal: ${s.funding_goal} | Raised: ${s.current_funding}
            </li>
          ))}
        </ul>
      )}

      <h4>Make an Investment</h4>
      <form onSubmit={handleInvestmentSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Startup ID"
          value={investForm.startup_id}
          onChange={(e) => setInvestForm({ ...investForm, startup_id: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Amount"
          type="number"
          value={investForm.amount}
          onChange={(e) => setInvestForm({ ...investForm, amount: e.target.value })}
          required
        />
        <button className="btn btn-success mb-4">Invest</button>
      </form>

      <h4>My Investments</h4>
      {investments.length === 0 ? (
        <p>No investments made yet.</p>
      ) : (
        <ul className="list-group">
          {investments.map((inv, idx) => (
            <li key={idx} className="list-group-item">
              Invested ${inv.amount} in <strong>{inv.startup}</strong> on{" "}
              {new Date(inv.date_invested).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
