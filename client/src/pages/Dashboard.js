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
      <h2>My Dashboard</h2>

      <div className="section">
        <h4>Create a Startup</h4>
        <form onSubmit={handleStartupSubmit}>
          <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="form-control mb-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input className="form-control mb-2" type="number" placeholder="Funding Goal" value={form.funding_goal} onChange={(e) => setForm({ ...form, funding_goal: e.target.value })} required />
          <button className="btn btn-primary mb-4">Create Startup</button>
        </form>
      </div>

      <div className="section">
        <h4>My Startups</h4>
        {startups.length === 0 ? (
          <p>No startups yet.</p>
        ) : (
          <ul className="list-group mb-4">
            {startups.map((s) => (
              <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                {s.name} | Goal: ${s.funding_goal} | Raised: ${s.current_funding}
                <div>
                  <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditStartup(s)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteStartup(s.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <h4>Make an Investment</h4>
        <form onSubmit={handleInvestmentSubmit}>
          <input className="form-control mb-2" placeholder="Startup ID" value={investForm.startup_id} onChange={(e) => setInvestForm({ ...investForm, startup_id: e.target.value })} required />
          <input className="form-control mb-2" placeholder="Amount" type="number" value={investForm.amount} onChange={(e) => setInvestForm({ ...investForm, amount: e.target.value })} required />
          <button className="btn btn-success mb-4">Invest</button>
        </form>
      </div>

      <div className="section">
        <h4>My Investments</h4>
        {investments.length === 0 ? (
          <p>No investments made yet.</p>
        ) : (
          <ul className="list-group">
            {investments.map((inv) => (
              <li key={inv.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  Invested ${inv.amount} in <strong>{inv.startup}</strong> on {new Date(inv.date_invested).toLocaleDateString()}
                </span>
                <div>
                  <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditInvestment(inv)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteInvestment(inv.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
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
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4">
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
        </div>
      )}
    </div>
  );
}
