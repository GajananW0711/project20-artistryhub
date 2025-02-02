import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          {/* Company Section */}
          <div className="col-md-4">
            <h5 className="text-uppercase">Company</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/about" className="text-light text-decoration-none">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Design Services Section */}
          <div className="col-md-4">
            <h5 className="text-uppercase">Design Services</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/design-contests" className="text-light text-decoration-none">Design Contests</Link>
              </li>
              <li>
                <Link to="/one-to-one-projects" className="text-light text-decoration-none">1-to-1 Projects</Link>
              </li>
              <li>
                <Link to="/find-artist" className="text-light text-decoration-none">Find a Designer</Link>
              </li>
            </ul>
          </div>

          {/* Get a Design Section */}
          <div className="col-md-4">
            <h5 className="text-uppercase">Get a Design</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/service/1" className="text-light text-decoration-none">Portrait Drawing</Link>
              </li>
              <li>
                <Link to="/service/2" className="text-light text-decoration-none">Modern Canvas Art</Link>
              </li>
              <li>
                <Link to="/service/3" className="text-light text-decoration-none">Bridal Mehendi</Link>
              </li>
              <li>
                <Link to="/service/4" className="text-light text-decoration-none">T-Shirt Printing</Link>
              </li>
              <li>
                <Link to="/service/5" className="text-light text-decoration-none">Embroidery</Link>
              </li>
              <li>
                <Link to="/services" className="text-light text-decoration-none">Browse All Categories</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="text-center mt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} Artistry Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
