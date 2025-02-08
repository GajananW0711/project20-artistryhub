import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ArtistDetails = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userRole = userData?.role;

  useEffect(() => {
    axios
      .get(`https://localhost:44327/api/artists/${artistId}`)
      .then((response) => {
        // Transform the data to properly extract portfolios from "$values"
        const artistData = {
          ...response.data,
          portfolios: response.data.portfolios?.$values || [], // Extract array from $values
        };
        setArtist(artistData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch artist details.");
        setLoading(false);
      });
  }, [artistId]);

  return (
    <div className="container mt-5">
      {loading && <p className="text-center text-muted">Loading artist details...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {artist && (
        <div className="row justify-content-center">
          {/* Profile Section */}
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0 rounded">
              <div className="card-body text-center">
                {/* Profile Picture */}
                <img
                  src={`https://localhost:44327/images/${artist.profilePicture}`}
                  alt="Artist"
                  className="rounded-circle img-fluid shadow"
                  style={{ height: "200px", width: "200px", objectFit: "cover" }}
                />

                {/* Artist Name */}
                <h2 className="mt-3 text-primary">{artist.firstName} {artist.lastName}</h2>

                {/* Location */}
                <p className="text-muted mb-2"><i className="bi bi-geo-alt"></i> {artist.location || "Location not available"}</p>

                {/* Bio */}
                <p className="lead">{artist.bio || "No bio available"}</p>

                {/* Chat Button */}
                {(userRole === "User" || userRole === "Artist") && (
                  <button className="btn btn-primary mt-3" onClick={() => navigate(`/chat/${artistId}`)}>
                    <i className="bi bi-chat-dots"></i> Chat with {artist.firstName}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="col-lg-10 mt-5">
            <h4 className="text-center text-secondary">Portfolio</h4>
            <div className="row g-4">
              {artist.portfolios.length > 0 ? (
                artist.portfolios.map((portfolio, index) => (
                  <div key={index} className="col-md-4">
                    <div className="card shadow-sm border-0">
                      <img
                        src={`https://localhost:44327/images/${portfolio.portfolioImage}`}
                        alt={`Portfolio ${index + 1}`}
                        className="card-img-top img-fluid"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <p className="card-text text-center">{portfolio.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No portfolio available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;
