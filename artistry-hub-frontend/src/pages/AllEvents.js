import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:44327/api/Events")
      .then((response) => {
        if (response.data && Array.isArray(response.data.$values)) {
          setEvents(response.data.$values);
        } else {
          setError("Invalid response format.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch events.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">All Events</h2>

      {loading && <p className="text-center">Loading events...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.eventId} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.eventName}</h5>
                  <p className="text-muted">{event.eventDate}</p>
                  <p>{event.description}</p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <Link to={`/event/${event.eventId}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
