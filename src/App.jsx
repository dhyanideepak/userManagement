import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const App = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  // Add new user
  const addUser = async () => {
    try {
      const newUser = { ...form, id: users.length + 1 }; 
      await axios.post(API_URL, newUser);
      setUsers([...users, newUser]);
      clearForm();
    } catch (err) {
      setError("Failed to add user. Please try again.");
    }
  };

  // Edit existing user
  const editUser = async () => {
    try {
      await axios.put(`${API_URL}/${form.id}`, form);
      setUsers(users.map((user) => (user.id === form.id ? form : user)));
      clearForm();
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update user. Please try again.");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    }
  };

  // Form handling
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    });
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>User Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          isEditing ? editUser() : addUser();
        }}
      >
        <div style={{textAlign:'center'}}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleFormChange}
            required
          />
          <br />
          <br />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleFormChange}
            required
          />
          <br />
          <br />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleFormChange}
            required
          />
          <br />
          <br />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleFormChange}
            required
          />
          <br />
          <br />
          <button type="submit">{isEditing ? "Update" : "Add"} User</button>
          {isEditing && <button onClick={clearForm}>Cancel</button>}
        </div>
      </form>

      <table border="1" style={{ width: "100%", marginTop: "20px",borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style={{textAlign:'center'}}>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName || user.name.split(" ")[0]}</td>
              <td>{user.lastName || user.name.split(" ")[1]}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td style={{ width: "200px" }}>
                <button onClick={() => handleEdit(user)} >Edit</button>
                <button onClick={() => deleteUser(user.id)} style={{marginLeft:'40px'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
