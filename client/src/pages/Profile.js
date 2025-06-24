import React, { useEffect, useState } from "react";
import { getProfile } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile(token);
        setUser(res);
      } catch (err) {
        console.error("Error loading profile:", err.message);
      }
    };
    load();
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profile_image", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/users/profile-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setUser((prev) => ({
          ...prev,
          profile_image: updated.profile_image,
        }));
        setSelectedFile(null);
        setPreviewURL(null);
      } else {
        console.error("Failed to upload profile image");
      }
    } catch (err) {
      console.error("Error uploading image:", err.message);
    }
  };

  const profilePicUrl = previewURL
    ? previewURL
    : user?.profile_image
    ? `http://localhost:5000/static/uploads/${user.profile_image}`
    : `http://localhost:5000/static/uploads/default-avatar.png`;

  return user ? (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "60px" }}>
      <h2 className="text-center mb-3">My Profile</h2>

      <div style={{ textAlign: "center" }}>
        <img
          src={profilePicUrl}
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
            border: "2px solid #ccc",
          }}
        />
      </div>

      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Admin:</strong> {user.is_admin ? "Yes" : "No"}</p>

      <form onSubmit={handleUpload} encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={handleFileChange}
        />
        <button type="submit" className="btn btn-primary w-100">
          Update Profile Picture
        </button>
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
