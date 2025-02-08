import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    eventName: "",
    description: "",
    eventDate: "",
    location: "",
    eventPrice: "",
  });
  const [artistId, setArtistId] = useState(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?.userId;

  const fetchArtistId = async (userId) => {
    try {
      const response = await fetch(`https://localhost:44327/artist/user/${userId}`);
      if (!response.ok) {
        throw new Error("Artist not found");
      }
      const data = await response.json();
      setArtistId(data.artistId);
    } catch (error) {
      console.error("Error fetching artist:", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchArtistId(userId);
    }
  }, [userId]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!artistId) {
      alert("Artist ID not found.");
      return;
    }

    const formattedEventDate = new Date(eventData.eventDate).toISOString().split("T")[0];

    const eventPayload = {
      UserId: artistId,
      EventName: eventData.eventName,
      Description: eventData.description,
      EventDate: formattedEventDate,
      Location: eventData.location,
      EventPrice: eventData.eventPrice ? parseInt(eventData.eventPrice) : null,
    };

    try {
      const response = await fetch("https://localhost:44327/api/Events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      alert("Event created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Create Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input
              type="text"
              className="form-control"
              name="eventName"
              placeholder="Enter event name"
              value={eventData.eventName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Description</label>
            <textarea
              className="form-control"
              name="description"
              placeholder="Enter event description"
              value={eventData.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              className="form-control"
              name="eventDate"
              value={eventData.eventDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              placeholder="Enter location"
              value={eventData.location}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Price</label>
            <input
              type="number"
              className="form-control"
              name="eventPrice"
              placeholder="Enter event price"
              value={eventData.eventPrice}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
