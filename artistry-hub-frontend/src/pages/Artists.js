import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Artists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://51.20.56.125:44327/api/artists");
      console.log("API Response:", response.data);
      setArtists(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching artists", error);
    }
  };

  const deleteArtist = async (userId) => {
    try {
      await axios.delete(`http://51.20.56.125:44327/api/artists/${userId}`);
      setArtists(artists.filter(artist => artist.userId !== userId));
    } catch (error) {
      console.error("Error deleting artist", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Artists List</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.userId}>
                <td>{artist.firstName}</td>
                <td>{artist.lastName}</td>
                <td>{artist.email}</td>
                <td>{artist.phone}</td>
                <td>{artist.location}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteArtist(artist.userId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Artists;
