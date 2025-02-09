import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ServiceDetail = () => {
  const { serviceId } = useParams(); // Get the serviceId from the URL
  const [serviceDetail, setServiceDetail] = useState(null);
  const [artists, setArtists] = useState([]); // Store artists related to this service
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch service details
  useEffect(() => {
    axios
      .get(`http://51.20.56.125:44327/api/services-for-user/get-service-by-id/${serviceId}`)
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
      .get(`http://51.20.56.125:44327/get-artist/${serviceId}`)
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
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div> <p className="mt-2 text-muted">Loading service details...</p></div>;
  }

  if (error) {
    return <p className="text-danger text-center mt-4">{error}</p>;
  }

  return (
    <div className="container mt-5">
      {/* Service Title */}
      <h2 className="text-center text-primary fw-bold mb-4">{serviceDetail?.serviceName}</h2>

      {/* Service Detail Card */}
      <div className="card shadow-lg mb-4">
        <div className="card-body">
          <h5 className="card-title fw-bold">{serviceDetail?.serviceName}</h5>
          <p className="card-text">{serviceDetail?.description}</p>
          <p className="text-muted"><strong>Category:</strong> {serviceDetail?.category?.categoryName}</p>
        </div>
      </div>

      {/* Artists offering this service */}
      <h3 className="text-primary fw-bold mb-3">Artists Providing This Service</h3>
      <div className="row">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <div key={artist.artistId} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card shadow-sm border-0">
                <img
                  src={artist.profilePicture}
                  className="card-img-top"
                  alt={`${artist.firstName} ${artist.lastName}`}
                  style={{ height: "250px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{artist.firstName} {artist.lastName}</h5>
                  <p className="card-text text-muted">{artist.bio}</p>
                  <Link
                    to={`/artist/${artist.artistId}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Full Portfolio
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No artists available for this service.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
