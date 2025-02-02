import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ServiceDetail = () => {
  const { serviceId } = useParams(); // Get the serviceId from the URL
  const [serviceDetail, setServiceDetail] = useState(null);
  const [artists, setArtists] = useState([]); // Store artists related to this service
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch service details
  useEffect(() => {
    axios
      .get(`https://localhost:44327/api/services-for-user/get-service-by-id/${serviceId}`)
      .then((response) => {
        setServiceDetail(response.data);
      })
      .catch(() => {
        setError("Failed to fetch service details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serviceId]);

  // Fetch artists related to this service
  useEffect(() => {
    axios
      .get(`https://localhost:44327/get-artist/${serviceId}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.$values)) {
          setArtists(response.data.$values); // Extract artists from $values array
        } else {
          setError("Artist data is not in the expected format.");
        }
      })
      .catch(() => {
        setError("Failed to fetch artists.");
      });
  }, [serviceId]);

  if (loading) {
    return <p>Loading service details...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">{serviceDetail?.serviceName}</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{serviceDetail?.serviceName}</h5>
          <p>{serviceDetail?.description}</p>
          <p><strong>Category:</strong> {serviceDetail?.category?.categoryName}</p>
        </div>
      </div>

      {/* Artists offering this service */}
      <h3 className="text-primary">Artists Providing This Service</h3>
      <div className="row">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <div key={artist.artistId} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={artist.profilePicture}
                  className="card-img-top"
                  alt={`${artist.firstName} ${artist.lastName}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{artist.firstName} {artist.lastName}</h5>
                  <p className="card-text">{artist.bio}</p>
                  <a
                    href={artist.portfolioLink}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No artists available for this service.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
