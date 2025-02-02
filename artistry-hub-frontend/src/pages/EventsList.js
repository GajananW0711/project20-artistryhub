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
      <h2 className="text-center text-primary mb-4">Upcoming Events</h2>

      {loading && <p className="text-center">Loading events...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {events.length > 0 && (
        <>
          <Carousel prevIcon={<span className="carousel-control-prev-icon" />} nextIcon={<span className="carousel-control-next-icon" />} controls={true} indicators={false} interval={null}>
  {events.map((event) => (
    <Carousel.Item key={event.eventId}>
      <div className="card text-center p-4 shadow-sm">
        <h4 className="card-title">{event.eventName}</h4>
        <p className="text-muted">{event.eventDate}</p>
        <p>{event.description}</p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <Link to={`/event/${event.eventId}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </Carousel.Item>
  ))}
</Carousel>


          {/* Show All Events Button */}
          <div className="text-center mt-4">
            <button className="btn btn-secondary" onClick={() => navigate("/all-events")}>
              Show All Events
            </button>
          </div>
        </>
      )}

      {events.length === 0 && !loading && <p className="text-center">No events available.</p>}
    </div>
  );
};

export default EventsList;
