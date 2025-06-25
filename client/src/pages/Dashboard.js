import React, { useEffect, useState } from "react";
import {
  getMyStartups,
  getMyInvestments,
  createStartup,
  invest,
  updateStartup,
  deleteStartup,
  updateInvestment,
  deleteInvestment,
} from "../api";
import EditStartupModal from "../components/EditStartupModal";
import "../styles/Dashboard.css";

export default function Dashboard({ user }) {
  const [startups, setStartups] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", funding_goal: "" });
  const [investForm, setInvestForm] = useState({ startup_id: "", amount: "" });
  const [editingStartup, setEditingStartup] = useState(null);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setStartups(await getMyStartups(token));
    setInvestments(await getMyInvestments(token));
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

  const handleEditStartup = (startup) => setEditingStartup(startup);

  const handleDeleteStartup = async (id) => {
    await deleteStartup(token, id);
    loadData();
  };

  const handleUpdateStartup = async (id, updatedData) => {
    await updateStartup(token, id, updatedData);
    setEditingStartup(null);
    loadData();
  };

  const handleEditInvestment = (investment) => {
    setEditingInvestment(investment);
    setEditAmount(investment.amount);
  };

  const handleUpdateInvestment = async (e) => {
    e.preventDefault();
    await updateInvestment(token, editingInvestment.id, parseFloat(editAmount));
    setEditingInvestment(null);
    setEditAmount("");
    loadData();
  };

  const handleDeleteInvestment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this investment?")) return;
    await deleteInvestment(token, id);
    loadData();
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <img
          src={
            user?.profile_image
              ? `http://localhost:5000/static/uploads/${user.profile_image}`
              : "/static/default-avatar.png"
          }
          alt="avatar"
          className="avatar"
        />
        <div>
          <h2>Welcome, {user?.username || "User"}!</h2>
          <p className="text-muted">Manage your startups and investments</p>
        </div>
      </div>

      <div className="cards-container">
        <div className="card-box">
          <h4>Create a Startup 🚀</h4>
          <form onSubmit={handleStartupSubmit}>
            <input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="form-control" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <input className="form-control" type="number" placeholder="Funding Goal" value={form.funding_goal} onChange={(e) => setForm({ ...form, funding_goal: e.target.value })} required />
            <button className="btn btn-primary w-100 mt-2">Create</button>
          </form>
        </div>

        <div className="card-box">
          <h4>Invest 💰</h4>
          <form onSubmit={handleInvestmentSubmit}>
            <input className="form-control" placeholder="Startup ID" value={investForm.startup_id} onChange={(e) => setInvestForm({ ...investForm, startup_id: e.target.value })} required />
            <input className="form-control" type="number" placeholder="Amount" value={investForm.amount} onChange={(e) => setInvestForm({ ...investForm, amount: e.target.value })} required />
            <button className="btn btn-success w-100 mt-2">Invest</button>
          </form>
        </div>
      </div>

      <div className="section">
        <h4>📊 My Startups</h4>
        {startups.length === 0 ? (
          <p className="text-muted">No startups yet.</p>
        ) : (
          <div className="grid">
            {startups.map((s) => (
              <div key={s.id} className="card-list">
                <h5>{s.name}</h5>
                <p>Category: {s.category}</p>
                <p>Goal: ${s.funding_goal}</p>
                <p>Raised: ${s.current_funding}</p>
                <div className="d-flex justify-content-between mt-2">
                  <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditStartup(s)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteStartup(s.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h4>📈 My Investments</h4>
        {investments.length === 0 ? (
          <p className="text-muted">No investments made yet.</p>
        ) : (
          <div className="grid">
            {investments.map((inv) => (
              <div key={inv.id} className="card-list">
                <p><strong>${inv.amount}</strong> in {inv.startup_name}</p>
                <small>{new Date(inv.date_invested).toLocaleDateString()}</small>
                <div className="d-flex justify-content-between mt-2">
                  <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditInvestment(inv)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteInvestment(inv.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingStartup && (
        <EditStartupModal
          startup={editingStartup}
          onClose={() => setEditingStartup(null)}
          onSave={handleUpdateStartup}
        />
      )}

      {editingInvestment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Edit Investment</h5>
            <form onSubmit={handleUpdateInvestment}>
              <input
                className="form-control mb-2"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success me-2">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingInvestment(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
