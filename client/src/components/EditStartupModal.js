import React, { useState } from "react";
import "../styles/Dashboard.css";

const EditStartupModal = ({ startup, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: startup.name,
    category: startup.category,
    funding_goal: startup.funding_goal,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(startup.id, form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Edit Startup</h4>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="form-control mb-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input className="form-control mb-3" type="number" placeholder="Funding Goal" value={form.funding_goal} onChange={(e) => setForm({ ...form, funding_goal: e.target.value })} required />
          <button className="btn btn-success me-2" type="submit">Save</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditStartupModal;
