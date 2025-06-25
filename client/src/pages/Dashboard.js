import React, { useEffect, useState } from "react";
import {
  getProfile,
  getMyStartups,
  getMyInvestments,
  createStartup,
  updateStartup,
  deleteStartup,
  invest,
  getAllStartups,
  updateInvestment,
  deleteInvestment,
} from "../api";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [myStartups, setMyStartups] = useState([]);
  const [myInvestments, setMyInvestments] = useState([]);
  const [publicStartups, setPublicStartups] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", funding_goal: "" });
  const [investForm, setInvestForm] = useState({ startup_id: "", amount: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getProfile(token);
        const startups = await getMyStartups(token);
        const investments = await getMyInvestments(token);
        const allStartups = await getAllStartups(token);

        setUser(profile);
        setMyStartups(startups);
        setMyInvestments(investments);
        // Exclude user's own startups from the investable list
        setPublicStartups(allStartups.filter(s => s.owner !== profile.username));
      } catch (err) {
        alert(err.message);
      }
    };
    loadData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateStartup(token, editing, form);
      } else {
        await createStartup(token, form);
      }
      setForm({ name: "", category: "", funding_goal: "" });
      setEditing(null);
      const startups = await getMyStartups(token);
      const allStartups = await getAllStartups(token);
      setMyStartups(startups);
      setPublicStartups(allStartups.filter(s => s.owner !== user.username));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (startup) => {
    setForm({
      name: startup.name,
      category: startup.category,
      funding_goal: startup.funding_goal,
    });
    setEditing(startup.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStartup(token, id);
      const startups = await getMyStartups(token);
      const allStartups = await getAllStartups(token);
      setMyStartups(startups);
      setPublicStartups(allStartups.filter(s => s.owner !== user.username));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await invest(token, investForm.startup_id, parseFloat(investForm.amount));
      setInvestForm({ startup_id: "", amount: "" });
      const investments = await getMyInvestments(token);
      const allStartups = await getAllStartups(token);
      setMyInvestments(investments);
      setPublicStartups(allStartups.filter(s => s.owner !== user.username));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateInvestment = async (id, newAmount) => {
    try {
      await updateInvestment(token, id, parseFloat(newAmount));
      const investments = await getMyInvestments(token);
      const allStartups = await getAllStartups(token);
      setMyInvestments(investments);
      setPublicStartups(allStartups.filter(s => s.owner !== user.username));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteInvestment = async (id) => {
    try {
      await deleteInvestment(token, id);
      const investments = await getMyInvestments(token);
      const allStartups = await getAllStartups(token);
      setMyInvestments(investments);
      setPublicStartups(allStartups.filter(s => s.owner !== user.username));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <div className="header">
        <img
          src={`http://localhost:5000/${user.profile_image || "static/uploads/default-avatar.png"}`}
          alt="avatar"
          className="avatar"
        />
        <div>
          <h2>Welcome, {user.username}!</h2>
          <p>Manage your startups and investments</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-box">
        <h4>{editing ? "Edit Startup" : "Create a Startup"} 🚀</h4>
        <input
          className="form-control"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Funding Goal"
          value={form.funding_goal}
          onChange={(e) => setForm({ ...form, funding_goal: e.target.value })}
        />
        <button className="btn btn-primary" type="submit">
          {editing ? "Update" : "Create"}
        </button>
      </form>

      <form onSubmit={handleInvestmentSubmit} className="card-box">
        <h4>Invest 💰</h4>
        <select
          className="form-control"
          value={investForm.startup_id}
          onChange={(e) => setInvestForm({ ...investForm, startup_id: e.target.value })}
        >
          <option value="">Select a startup</option>
          {publicStartups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — by {s.owner}
            </option>
          ))}
        </select>
        <input
          className="form-control"
          placeholder="Amount"
          value={investForm.amount}
          onChange={(e) => setInvestForm({ ...investForm, amount: e.target.value })}
        />
        <button className="btn btn-success">Invest</button>
      </form>

      <div className="section">
        <h3>📊 My Startups</h3>
        <div className="grid">
          {myStartups.map((s) => (
            <div key={s.id} className="card-list">
              <h5>{s.name}</h5>
              <p>Category: {s.category}</p>
              <p>Goal: ${s.funding_goal}</p>
              <p>Raised: ${s.current_funding}</p>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(s)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>
                Delete
              </button>
            </div>
          ))}
          {myStartups.length === 0 && <p>No startups yet.</p>}
        </div>
      </div>

      <div className="section">
        <h3>📈 My Investments</h3>
        <div className="grid">
          {myInvestments.map((inv) => (
            <div key={inv.id} className="card-list">
              <p>
                <strong>${inv.amount}</strong> in <strong>{inv.startup_name}</strong>
              </p>
              <p>{new Date(inv.date_invested).toLocaleDateString()}</p>
              <div className="d-flex gap-2">
                <input
                  className="form-control form-control-sm"
                  placeholder="New Amount"
                  onChange={(e) =>
                    setMyInvestments((prev) =>
                      prev.map((i) =>
                        i.id === inv.id ? { ...i, newAmount: e.target.value } : i
                      )
                    )
                  }
                />
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleUpdateInvestment(inv.id, inv.newAmount)}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteInvestment(inv.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {myInvestments.length === 0 && <p>No investments made yet.</p>}
        </div>
      </div>

      <div className="section">
        <h3>🌍 All Public Startups</h3>
        <div className="grid">
          {publicStartups.map((s) => (
            <div key={s.id} className="card-list">
              <h5>{s.name}</h5>
              <p>Category: {s.category}</p>
              <p>Goal: ${s.funding_goal}</p>
              <p>Raised: ${s.current_funding}</p>
              <p>By: {s.owner}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
