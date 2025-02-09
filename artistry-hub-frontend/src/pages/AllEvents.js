import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isAdmin = userData?.role === "Admin"; // Check if user is an Admin

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://51.20.56.125:44327/api/Events");
        if (response.data && Array.isArray(response.data.$values)) {
          const approvedEvents = response.data.$values.filter((event) => event.status === "Approved");
          setEvents(approvedEvents);
        } else {
          throw new Error("Invalid response format.");
        }
      } catch (error) {
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle event deletion (Admin only)
  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      await axios.delete(`http://51.20.56.125:44327/api/Events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));
    } catch (error) {
      alert("Failed to delete the event. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Upcoming Events</h2>

      {loading && <p className="text-center text-muted">Loading events...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      <div className="row">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.eventId} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark">{event.eventName}</h5>
                  <p className="text-muted mb-1"><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                  <p className="mb-1">{event.description}</p>
                  <p className="mb-3"><strong>Location:</strong> {event.location}</p>

                  <div className="mt-auto">
                    <Link to={`/event/${event.eventId}`} className="btn btn-primary btn-sm me-2">
                      View Details
                    </Link>
                    
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event.eventId)}>
                        Delete Event
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-muted">No approved events available.</p>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
