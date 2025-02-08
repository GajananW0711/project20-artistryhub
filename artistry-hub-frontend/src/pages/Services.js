import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]);
  const [artistServices, setArtistServices] = useState([]);
  const [artistId, setArtistId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({
    serviceId: "",
    price: "",
    availability: "",
  });
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    axios
      .get("https://localhost:44327/api/services-for-user/get-all-services")
      .then((response) => {
        if (response.data && Array.isArray(response.data.$values)) {
          setServices(response.data.$values);
        } else {
          setError("Unexpected response format for services.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch services.");
        setLoading(false);
      });

    if (userData?.role === "Artist") {
      fetchArtistId(userData.userId);

      axios
        .get(`https://localhost:44327/api/ArtistServices/${userData.userId}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.$values)) {
            setArtistServices(response.data.$values);
          } else {
            setError("Unexpected response format for artist services.");
          }
        })
        .catch(() => {
          setError("Failed to fetch artist's services.");
        });
    }
  }, [userData]);

  const fetchArtistId = async (userId) => {
    try {
      const response = await fetch(`https://localhost:44327/artist/user/${userId}`);
      if (!response.ok) throw new Error("Artist not found");
      const data = await response.json();
      setArtistId(data.artistId);
    } catch (error) {
      console.error("Error fetching artist:", error.message);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!artistId) {
      alert("Artist ID not found. Please try again later.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:44327/api/ArtistServices", {
        userId: artistId,
        serviceId: newService.serviceId,
        price: newService.price,
        availability: newService.availability,
      });
      alert(response.data.Message);
      setArtistServices([...artistServices, response.data.ArtistService]);
      setNewService({ serviceId: "", price: "", availability: "" });
    } catch (error) {
      alert("Error adding service.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Services</h2>
      {loading && <div className="text-center spinner-border text-primary" role="status"></div>}
      {error && <p className="text-danger text-center">{error}</p>}

      <h3 className="fw-bold">All Available Services</h3>
      <div className="row mb-4">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service.serviceId} className="col-md-4 mb-4">
              <Link to={`/service/${service.serviceId}`} className="text-decoration-none">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{service.serviceName}</h5>
                    <p className="text-muted">{service.category.categoryName}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-muted">No services available.</p>
        )}
      </div>

      {userData?.role === "Artist" && (
        <>
          <h3 className="fw-bold">Your Services</h3>
          <div className="row mb-4">
            {artistServices.length > 0 ? (
              artistServices.map((service) => (
                <div key={service.artistServiceId} className="col-md-4 mb-4">
                  <Link to={`/service/${service.service.serviceId}`} className="text-decoration-none">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{service.service.serviceName}</h5>
                        <p className="text-muted">Price: {service.price}</p>
                        <p className="text-muted">Availability: {service.availability}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-muted">No artist services available.</p>
            )}
          </div>

          <h3 className="fw-bold">Add New Service</h3>
          <form onSubmit={handleAddService} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Select Service</label>
              <select
                className="form-control"
                value={newService.serviceId}
                onChange={(e) => setNewService({ ...newService, serviceId: e.target.value })}
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Availability</label>
              <input
                type="text"
                className="form-control"
                value={newService.availability}
                onChange={(e) => setNewService({ ...newService, availability: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">Add Service</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Services;
