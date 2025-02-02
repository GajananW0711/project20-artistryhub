import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

import Footer from "../components/Footer";

const RegistrationForm = () => {
  const [role, setRole] = useState("User");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });
  const [artistData, setArtistData] = useState({
    portfolio: "",
    skillTags: "",
    certifications: "",
    bio: "",
    profilePicture: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (role === "Artist" && ["portfolio", "skillTags", "certifications", "bio", "profilePicture"].includes(name)) {
      setArtistData({ ...artistData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.firstName.match(/^[A-Za-z]+$/)) {
      newErrors.firstName = "First name can only contain alphabets";
      isValid = false;
    }
    if (!formData.lastName.match(/^[A-Za-z]+$/)) {
      newErrors.lastName = "Last name can only contain alphabets";
      isValid = false;
    }
    if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)) {
      newErrors.password = "Password must be at least 8 characters long with letters, numbers, and a special character";
      isValid = false;
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userPayload = {
      User: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
      },
      Artist: role === "Artist" ? artistData : null,
    };

    try {
      await axios.post("https://localhost:44327/api/User", userPayload);
      alert("Registration Successful");
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center mb-4">Registration Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">First Name:</label>
                <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name:</label>
                <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label">Password:</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                {errors.password && <p className="text-danger">{errors.password}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label">Phone:</label>
                <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                {errors.phone && <p className="text-danger">{errors.phone}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label">Role:</label>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="role" value="User" checked={role === "User"} onChange={() => setRole("User")} />
                  <label className="form-check-label">User</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="role" value="Artist" checked={role === "Artist"} onChange={() => setRole("Artist")} />
                  <label className="form-check-label">Artist</label>
                </div>
              </div>

              {role === "Artist" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Portfolio:</label>
                    <input type="url" className="form-control" name="portfolio" value={artistData.portfolio} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Skills:</label>
                    <input type="text" className="form-control" name="skillTags" value={artistData.skillTags} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bio:</label>
                    <textarea className="form-control" name="bio" value={artistData.bio} onChange={handleChange} rows="3" required />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationForm;
