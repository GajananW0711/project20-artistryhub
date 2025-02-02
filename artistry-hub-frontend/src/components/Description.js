import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Description = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://99designs-start-static.imgix.net/homepage/little-danube.jpg?auto=format&w=370&h=370&q=45&dpr=2",
    "https://99designs-start-static.imgix.net/homepage/the-studio.jpg?auto=format&w=370&h=370&q=45&dpr=2",
    "https://99designs-start-static.imgix.net/homepage/feel-good-tea.jpg?auto=format&w=370&h=370&q=45&dpr=2",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Bootstrap Carousel */}
        <div className="col-md-6">
          <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === currentIndex ? "active" : ""}`}
                >
                  <img src={image} className="d-block w-100 rounded" alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="col-md-6">
          <h2 className="text-primary">Grow with Great Design</h2>
          <p>
            Welcome to <strong>Artistry Hub</strong>, where we help businesses and freelance artists thrive through exceptional design.
          </p>
          <p>
            Our platform connects artists with clients, allowing them to showcase their work, build their brand, and grow their creative businesses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Description;
