import React, { useState } from "react";
import { register } from "../api";
import "../styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", form.username);
    data.append("email", form.email);
    data.append("password", form.password);
    if (profileImage) {
      data.append("profile_image", profileImage);
    }

    try {
      await register(data, true); // true = multipart
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          className="form-control mb-2"
          placeholder="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
