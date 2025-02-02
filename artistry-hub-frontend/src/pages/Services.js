import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]); // Ensure services is initially an array
  const [artistServices, setArtistServices] = useState([]); // Ensure artistServices is initially an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({
    serviceId: "",
    price: "",
    availability: "",
  });
  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Fetch all available services
  useEffect(() => {
    axios
      .get("https://localhost:44327/api/services-for-user/get-all-services")
      .then((response) => {
        console.log("API Response (Services):", response.data); // Log the response to check its structure
        if (response.data && Array.isArray(response.data.$values)) {
          setServices(response.data.$values); // Set services to the array inside $values
        } else {
          setError("Received services data is not in the expected format.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch services.");
        setLoading(false);
      });

    // Fetch artist services if the user is an artist
    if (userData && userData.role === "Artist") {
      axios
        .get(`https://localhost:44327/api/ArtistServices/${userData.userId}`)
        .then((response) => {
          console.log("API Response (Artist Services):", response.data); // Log the response to check its structure
          if (response.data && Array.isArray(response.data.$values)) {
            setArtistServices(response.data.$values); // Access $values array for artist services
          } else {
            setArtistServices([]); // Set to empty array if data is not an array
            setError("Received artist services data is not an array.");
          }
        })
        .catch(() => {
          setError("Failed to fetch artist's services.");
        });
    }
  }, [userData]);

  // Handle adding a new service
  const handleAddService = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/ArtistServices", newService)
      .then((response) => {
        alert(response.data.Message);
        setArtistServices([...artistServices, response.data.ArtistService]);
        setNewService({
          serviceId: "",
          price: "",
          availability: "",
        });
      })
      .catch(() => {
        alert("Error adding service.");
      });
  };

  // Handle deleting a service (Admin only)
  const handleDeleteService = (serviceId) => {
    axios
      .delete(`http://localhost:5000/api/Services/delete-service/${serviceId}`)
      .then((response) => {
        alert(response.data.Message);
        setServices(services.filter((service) => service.serviceId !== serviceId));
      })
      .catch(() => {
        alert("Error deleting service.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Services</h2>

      {loading && <p className="text-center">Loading services...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* All Available Services */}
      <h3>All Available Services</h3>
      <div className="row mb-4">
        {Array.isArray(services) && services.length > 0 ? (
          services.map((service) => (
            <div key={service.serviceId} className="col-md-4 mb-4">
              <Link to={`/service/${service.serviceId}`} className="text-decoration-none">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{service.serviceName}</h5> {/* Updated to serviceName */}
                    <p>{service.category.categoryName}</p> {/* Updated to categoryName */}
                  </div>
                </div>
              </Link>

              {/* Delete button for Admin only */}
              {userData && userData.role === "Admin" && (
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleDeleteService(service.serviceId)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No services available.</p> // If services array is empty or not available
        )}
      </div>

      {/* Artist's Own Services (only visible for Artist) */}
      {userData && userData.role === "Artist" && (
        <>
          <h3>Your Services</h3>
          <div className="row mb-4">
            {Array.isArray(artistServices) && artistServices.length > 0 ? (
              artistServices.map((service) => (
                <div key={service.artistServiceId} className="col-md-4 mb-4">
                  <Link to={`/service/${service.service.serviceId}`} className="text-decoration-none">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{service.service.serviceName}</h5> {/* Updated to serviceName */}
                        <p>Price: {service.price}</p>
                        <p>Availability: {service.availability}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No artist services available.</p> // If artistServices array is empty or not available
            )}
          </div>

          {/* Form to Add New Service */}
          <h3>Add New Service</h3>
          <form onSubmit={handleAddService} className="mb-4">
            <div className="mb-3">
              <label htmlFor="serviceId" className="form-label">
                Select Service
              </label>
              <select
                id="serviceId"
                className="form-control"
                value={newService.serviceId}
                onChange={(e) =>
                  setNewService({ ...newService, serviceId: e.target.value })
                }
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
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="availability" className="form-label">
                Availability
              </label>
              <input
                type="text"
                className="form-control"
                id="availability"
                value={newService.availability}
                onChange={(e) =>
                  setNewService({ ...newService, availability: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Service
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Services;
