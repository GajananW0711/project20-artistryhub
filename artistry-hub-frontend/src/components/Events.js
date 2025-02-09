import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://51.20.56.125:44327/api/Events") // Adjust backend URL if needed
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch events.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Upcoming Events</h2>

      {loading && <p className="text-center">Loading events...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {events.map((event) => (
          <div key={event.eventId} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src={event.imageUrl || "https://via.placeholder.com/300"}
                className="card-img-top"
                alt={event.title}
              />
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">{event.description}</p>
                <p className="text-muted">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-muted">📍 {event.location}</p>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
