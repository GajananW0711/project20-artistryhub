import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData")); // Get user details
  const role = userData?.role; // Access the correct key "role"

  const handleLogout = () => {
    localStorage.removeItem("userData"); // Clear session data
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Artistry Hub</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/find-artist">Find Artist</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/services">Services</Link></li>

            {/* Role-Based Navigation */}
            {role === "User" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/wishlist">Wishlist</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/my-orders">My Orders</Link></li>
              </>
            )}

            {role === "Artist" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/create-event">Create Event</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/set-availability">Set Availability</Link></li>
              </>
            )}

            {role === "Admin" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/artists">Artists</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/events">Events</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/event-approval">Event Approval</Link></li>
              </>
            )}
          </ul>

          {/* Login / Logout Button */}
          {userData ? (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          ) : (
            <Link className="btn btn-primary" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
