import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    role: "User",
    bio: "",
    portfolio: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    try {
      const response = await axios.post("https://localhost:44327/api/Users", formData);
      setMessage(response.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        role: "User",
        bio: "",
        portfolio: ""
      });
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Register</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Artist">Artist</option>
          </select>
        </div>
        {formData.role === "Artist" && (
          <>
            <div className="mb-3">
              <label className="form-label">Bio</label>
              <textarea name="bio" className="form-control" value={formData.bio} onChange={handleChange} required></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Portfolio Link</label>
              <input type="url" name="portfolio" className="form-control" value={formData.portfolio} onChange={handleChange} required />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Registration;
