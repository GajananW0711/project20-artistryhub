import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UsersTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://51.20.56.125:44327/api/Users/get-users")
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else if (data.$values && Array.isArray(data.$values)) {
                    setUsers(data.$values);
                } else {
                    console.error("Unexpected response format:", data);
                    setUsers([]);
                }
            })
            .catch(error => console.error("Error fetching users:", error));
    }, []);
    
    const deleteUser = (userId) => {
        fetch(`http://51.20.56.125:44327/api/Users/${userId}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                setUsers(users.filter(user => user.userId !== userId));
            } else {
                console.error("Failed to delete user");
            }
        })
        .catch(error => console.error("Error deleting user:", error));
    };
    
    return (
        <div className="container mt-4">
            <h2 className="mb-3">User List</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteUser(user.userId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;
