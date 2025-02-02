import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch event details
    axios
      .get(`https://localhost:44327/api/Events/${eventId}`)
      .then((response) => {
        if (response.data) {
          setEvent(response.data);

          // Fetch artist details based on artistId
          return axios.get(`https://localhost:44327/api/Users/api/ArtistServices/${response.data.artistId}`);
        } else {
          setError("Event not found.");
          setLoading(false);
        }
      })
      .then((artistResponse) => {
        if (artistResponse?.data) {
          setArtist(artistResponse.data);
        } else {
          setError("Artist not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch event or artist details.");
        setLoading(false);
      });
  }, [eventId]);

  return (
    <div className="container mt-5">
      {loading && <p className="text-center">Loading event details...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {event && (
        <div className="card shadow-lg p-4">
          <h2 className="text-center text-primary">{event.eventName}</h2>
          <p className="text-muted text-center">{event.eventDate}</p>
          <p>{event.description}</p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>

          {artist && (
            <div className="mt-4">
              <h4 className="text-primary">Artist Details</h4>
              <div className="text-center">
                <img
                  src={artist.profilePicture || "https://via.placeholder.com/150"}
                  alt={artist.firstName}
                  className="rounded-circle"
                  style={{ height: "150px", width: "150px", objectFit: "cover" }}
                />
              </div>
              <h5 className="text-center">{artist.firstName} {artist.lastName}</h5>
              <p className="text-center">{artist.bio}</p>
              <p className="text-center">
                <strong>Portfolio:</strong> <a href={artist.portfolioLink} target="_blank" rel="noopener noreferrer">{artist.portfolioLink}</a>
              </p>

              <h6>Services Offered:</h6>
              <ul>
                {artist.services && artist.services.length > 0 ? (
                  artist.services.map((service) => (
                    <li key={service.serviceId}>
                      {service.serviceName} - {service.description}
                    </li>
                  ))
                ) : (
                  <p>No services listed.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetail;
