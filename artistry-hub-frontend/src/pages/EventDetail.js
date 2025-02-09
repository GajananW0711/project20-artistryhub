import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    axios
      .get(`http://51.20.56.125:44327/api/Events/${eventId}`)
      .then((response) => {
        if (response.data) {
          setEvent(response.data);
        } else {
          setError("Event not found.");
        }
      })
      .catch(() => setError("Failed to fetch event details."))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (!event?.artistId) return;
    axios
      .get(`http://51.20.56.125:44327/api/artists/${event.artistId}`)
      .then((response) => {
        // Transform the data to properly extract portfolios from "$values"
        const artistData = {
          ...response.data,
          portfolios: response.data.portfolios?.$values || [], // Extract array from $values
        };
        setArtist(artistData);
        setLoading(false);
      })
      .catch(() => setError("Failed to fetch artist details."));
  }, [event?.artistId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBookNow = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("❌ Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    if (!event) return;

    const options = {
      key: "rzp_test_twI0P0m7kPpxcb",
      amount: event.ticketPrice * 100,
      currency: "INR",
      name: "Event Booking",
      description: `Booking for ${event.eventName}`,
      handler: function (response) {
        axios
          .post("http://51.20.56.125:44327/api/BookEvent", {
            userId: userData?.userId || "Guest",
            artistId: event.artistId,
            eventId: eventId,
            totalAmount: event.ticketPrice,
            paymentId: response.razorpay_payment_id,
            eventDate: event.eventDate,
            status: "Paid",
          })
          .then(() => {
            toast.success("🎉 Booking successful!");
          })
          .catch(() => toast.error("❌ Failed to save booking."));
      },
      prefill: {
        name: userData?.name || "User Name",
        email: userData?.email || "user@example.com",
        contact: userData?.phone || "1234567890",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container mt-5">
      <ToastContainer /> 
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
              <h5 className="text-center">
                {artist.firstName} {artist.lastName}
              </h5>
              <p className="text-center">{artist.bio}</p>
              
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

          <button className="btn btn-primary btn-lg w-100 mt-4" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
