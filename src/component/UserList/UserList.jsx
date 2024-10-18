import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./userlist.scss";

const UserList = () => {
  const [users, setUsers] = useState([]); // State to hold the list of users
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [editingUser, setEditingUser] = useState(null); // State for the user being edited
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "" }); // State for form inputs
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const navigate = useNavigate();

  // Fetch users when the component mounts or when currentPage changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Redirect to login if no token is present
    if (!token) {
      navigate("/");
      return;
    }

    // Fetch users from API
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // user Axios to fetch data from API
        const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data); // Set state for users from response
      } catch (error) {
        // Error handling with notification
        toast.error(`Error fetching users: ${error.response?.data?.error || error.message}`);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchUsers();
  }, [navigate, currentPage]);

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < 2 ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  //Logout function
  const logout = () => { 
    localStorage.removeItem("token");
    navigate("/");
  };

  // Set the user to edit !!
  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  // Handle user deletion
  const handleDeleteClick = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId)); // Update user list
      toast.success("User deleted successfully."); // Notification
    } catch (error) {
      // Error handling with notification
      toast.error(`Error deleting user: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Update user details
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser ? { ...user, ...formData } : user
        )
      );
      toast.success("User updated successfully."); // Notification
      setEditingUser(null); // Reset editing user
      setFormData({ first_name: "", last_name: "", email: "" }); // Clear form data
    } catch (error) {
      // Error handling with notification
      toast.error(`Error updating user: ${error.response?.data?.error || error.message}`);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user_list_container">

      <div className="container_markup">
        <div className="user_list_headline">Say hi to users</div>
        <div className="logout" onClick={logout}>Logout</div>
      </div>

      {/* Search Input */}
      <div className="search_user"> 
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        className="search_input" 
      />
       </div>

         
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="list_users_containers">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id}>
                  <div className="template_user">
                    <img className="user_img" alt={user.first_name} src={user.avatar} />
                    <div className="user_details">
                      <div className="first_name_user" style={{color: "#168700"}}>{user.first_name} {user.last_name}</div>
                      <div className="email_users"><img className="mail_connect" src="./mail.png" alt="" />{user.email}</div>
                    </div>
                    <div className="edit_delete_button">
                      <button className="edit_details" onClick={() => handleEditClick(user)}>Edit</button>
                      <button className="edit_details" onClick={() => handleDeleteClick(user.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <li style={{color: "white"}}>No users found.</li>
            )}
          </div>


          {/* Pagination Section */}
          <div className="pagination_section">
            <button
              className="pagination_button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span
              className={`page_number ${currentPage === 1 ? "active_page" : ""}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </span>
            <span
              className={`page_number ${currentPage === 2 ? "active_page" : ""}`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </span>

            <button
              className="pagination_button"
              onClick={handleNextPage}
              disabled={currentPage === 2}
            >
              Next
            </button>
          </div>

          {/* Dialogg box for Editing User */}
          {editingUser && (
            <div className="modal_overlay">
              <div className="modal_content">
                <button className="close_button" onClick={() => setEditingUser(null)}>
                  &times;
                </button>
                <form onSubmit={handleUpdateUser}>
                  <div className="edit_user">Edit User Details</div>
                  <div className="edit_form_details">
                    <div className="edit_inputs">
                      <input
                        type="text"
                        id="input_first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleFormChange}
                        placeholder="First Name"
                        required
                      />
                      <input
                        type="text"
                        id="input_last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleFormChange}
                        placeholder="Last Name"
                        required
                      />
                      <input
                        type="email"
                        id="input_email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="edit_buttons">
                      <button className="edit_execute" type="submit">Update User</button>
                      <button className="edit_cancel" type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default UserList;
