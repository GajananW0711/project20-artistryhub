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
import Chat from "./components/Chat";
import Messages from "./pages/Messages";
import CreateEvent from "./pages/CreateEvent";
import EventApproval from "./pages/EventApproval";
import UsersTable from "./pages/UsersTable";
import Artists from "./pages/Artists";


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
        <Route path="/create-event" element={<CreateEvent/>} />
        <Route path="/set-availability" element={<h1>Set Availability</h1>} />
        <Route path="/users" element={<UsersTable />}/>
        <Route path="/artists" element={<Artists/>} />
        <Route path="/events" element={<EventsList/>} />
        <Route path="/event-approval" element={<EventApproval/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist/:artistId" element={<ArtistDetails/>} />
        <Route path="/service/:serviceId" element={<ServiceDetail/>} />
        <Route path="/artist/:artistId" component={<ArtistDetails/>} />
        <Route path="/all-events" element={<AllEvents/>} />
        <Route path="/event/:eventId" element={<EventDetail/>} />
        <Route path="/register" element={<RegistrationForm/>} />
        <Route path="/chat/:artistId" element={<Chat />} />
        <Route path="/messages" element={<Messages/>} />
      </Routes>
    </Router>
  );
};

export default App;
