import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ArtistDetails = () => {
  const { artistId } = useParams(); // Access the artistId from URL params
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Artists/${artistId}`) // Fetch artist by artistId
      .then((response) => {
        setArtist(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch artist details.");
        setLoading(false);
      });
  }, [artistId]);

  return (
    <div className="container mt-5">
      {loading && <p className="text-center">Loading artist details...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {artist && (
        <div className="text-center">
          <img
            src={artist.profilePicture || "https://via.placeholder.com/300"}
            alt={artist.bio}
            className="rounded-circle"
            style={{ height: "300px", width: "300px", objectFit: "cover" }}
          />
          <h3 className="mt-4">{artist.bio}</h3>
          {/* Display other artist details here */}
          <p>{artist.fullName}</p>
          <p>{artist.email}</p>
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;
