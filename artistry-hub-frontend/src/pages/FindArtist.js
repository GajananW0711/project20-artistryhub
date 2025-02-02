import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For navigation
import "bootstrap/dist/css/bootstrap.min.css";

const FindArtist = () => {
  const [artists, setArtists] = useState([]); // Artists array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:44327/api/Users") // Adjust backend URL if needed
      .then((response) => {
        console.log("API Response (Artists):", response.data); // Log the response to check its structure
        if (response.data && Array.isArray(response.data.$values)) {
          const artistsWithServices = response.data.$values.map((artist) => {
            return {
              ...artist,
              services: artist.services?.$values || [] // Ensure services are correctly included
            };
          });
          setArtists(artistsWithServices); // Set artists with services
        } else {
          setError("Received data is not in the expected format.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch artists.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Find an Artist</h2>

      {loading && <p className="text-center">Loading artists...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {Array.isArray(artists) && artists.length > 0 ? (
          artists.map((artist) => (
            <div key={artist.artistId} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={artist.profilePicture || "https://via.placeholder.com/300"}
                  className="card-img-top rounded-circle"
                  alt={artist.bio}
                  style={{ height: "200px", width: "200px", objectFit: "cover", margin: "0 auto" }}
                />
                <div className="card-body text-center">
                  <h3 className="card-text">{artist.firstName} {artist.lastName}</h3>
                  <h6 className="card-title">{artist.bio}</h6>
                  
                  <p className="card-text">{artist.location}</p>
                  <Link
                    to={`/artist/${artist.artistId}`} // Navigate to the artist's detail page
                    className="btn btn-primary"
                  >
                    View Full Portfolio
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No artists found.</p>
        )}
      </div>
    </div>
  );
};

export default FindArtist;
