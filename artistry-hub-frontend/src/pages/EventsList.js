import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isAdmin = userData?.role === "Admin";

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

      {events.length > 0 ? (
        <>
          <Carousel
            controls={true}
            indicators={false}
            interval={null}
            prevIcon={<span className="carousel-control-prev-icon bg-dark rounded-circle p-3" />}
            nextIcon={<span className="carousel-control-next-icon bg-dark rounded-circle p-3" />}
          >
            {events.map((event) => (
              <Carousel.Item key={event.eventId} className="text-center">
                <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
                  <h4 className="card-title text-dark">{event.eventName}</h4>
                  <p className="text-muted">
                    <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <p className="mb-2">{event.description}</p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <div className="d-flex justify-content-center mt-3">
                    <Link to={`/event/${event.eventId}`} className="btn btn-primary me-2">
                      View Details
                    </Link>

                    {isAdmin && (
                      <button className="btn btn-danger" onClick={() => handleDelete(event.eventId)}>
                        Delete Event
                      </button>
                    )}
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          {/* Show All Events Button */}
          <div className="text-center mt-4">
            <button className="btn btn-secondary px-4" onClick={() => navigate("/all-events")}>
              View All Events
            </button>
          </div>
        </>
      ) : (
        !loading && <p className="text-center text-muted">No approved events available.</p>
      )}
    </div>
  );
};

export default EventsList;
