import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ArtistDetails from "./pages/ArtistDetails";
import FindArtist from "./pages/FindArtist";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import EventsList from "./pages/EventsList";
import "bootstrap/dist/css/bootstrap.min.css";
import AllEvents from "./pages/AllEvents";
import EventDetail from "./pages/EventDetail";
import RegistrationForm from "./pages/Registration";


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/find-artist" element={<FindArtist/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/wishlist" element={<h1>Wishlist</h1>} />
        <Route path="/my-orders" element={<h1>My Orders</h1>} />
        <Route path="/create-event" element={<h1>Create Event</h1>} />
        <Route path="/set-availability" element={<h1>Set Availability</h1>} />
        <Route path="/users" element={<h1>Users</h1>} />
        <Route path="/artists" element={<h1>Artists</h1>} />
        <Route path="/events" element={<EventsList/>} />
        <Route path="/event-approval" element={<h1>Event Approval</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist/:artistId" element={<ArtistDetails/>} />
        <Route path="/service/:serviceId" element={<ServiceDetail/>} />
        <Route path="/artist/:artistId" component={<ArtistDetails/>} />
        <Route path="/all-events" element={<AllEvents/>} />
        <Route path="/event/:eventId" component={<EventDetail/>} />
        <Route path="/register" element={<RegistrationForm/>} />
      </Routes>
    </Router>
  );
};

export default App;
