import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch("https://localhost:44327/api/Events/pending")
      .then((res) => res.json())
      .then((data) => setEvents(data.$values || []))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleEventClick = (event) => {
    fetch(`https://localhost:44327/api/Events/${event.eventId}`)
      .then((res) => res.json())
      .then((data) => setSelectedEvent(data))
      .catch((err) => console.error("Error fetching event details:", err));
  };

  const updateEventStatus = (eventId, status) => {
    fetch(`https://localhost:44327/api/Events/${eventId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        setEvents(events.filter((event) => event.eventId !== eventId));
        setSelectedEvent(null);
      })
      .catch((err) => console.error("Error updating event status:", err));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Pending Events</h2>
      <div className="list-group">
        {events.map((event) => (
          <div
            key={event.eventId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 className="mb-1">{event.eventName}</h5>
              <small>{event.eventDate}</small>
            </div>
            <div>
              <button className="btn btn-primary me-2" onClick={() => handleEventClick(event)}>View Details</button>
              <button className="btn btn-success me-2" onClick={() => updateEventStatus(event.eventId, "Approved")}>
                Approve
              </button>
              <button className="btn btn-danger" onClick={() => updateEventStatus(event.eventId, "Rejected")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEvent.eventName}</h5>
                <button type="button" className="close" onClick={() => setSelectedEvent(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Description:</strong> {selectedEvent.description}</p>
                <p><strong>Date:</strong> {selectedEvent.eventDate}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Price:</strong> {selectedEvent.eventPrice || "Free"}</p>
                <p><strong>Status:</strong> {selectedEvent.status}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={() => updateEventStatus(selectedEvent.eventId, "Approved")}>
                  Approve
                </button>
                <button className="btn btn-danger" onClick={() => updateEventStatus(selectedEvent.eventId, "Rejected")}>
                  Reject
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventApproval;
