import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./userlist.scss";

const UserList = () => {
  const [users, setUsers] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [loading, setLoading] = useState(true); 
  const [editingUser, setEditingUser] = useState(null); 
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "" });
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data);
      } catch (error) {
        toast.error(`Error fetching users: ${error.response?.data?.error || error.message}`, {
          autoClose: 3000, // Notification auto-closes after 5 seconds
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < 2 ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleDeleteClick = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`https://reqres.in/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 204) {
        // Show success notification first
        toast.error("User deleted successfully.", {
          autoClose: 3000, // Notification auto-closes after 3 seconds
        });
        
        // Then update the users state
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      toast.error(`Error deleting user: ${error.response?.data?.error || error.message}`, {
        autoClose: false,  // Keep error notification open until manually closed
      });
    }
  };
  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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

      toast.success("User updated successfully.", {
        onClose: () => {
          setEditingUser(null);
          setFormData({ first_name: "", last_name: "", email: "" });
        },
        autoClose: 2000, // Notification auto-closes after 5 seconds
      });
    } catch (error) {
      toast.error(`Error updating user: ${error.response?.data?.error || error.message}`, {
        autoClose: false, // Keep error notification open until manually closed
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const colors = [
    "#FF6F61",  // Coral Red
    "#6B5B95",  // Rich Purple
    "#88B04B",  // Soft Green
    "#F7CAC9",  // Pale Pink
    "#92A8D1",  // Calm Blue
    "#FFCC5C"   // Golden Yellow
  ];
  const hoverColors = ["#d1a6d8", "#a6c8e1", "#a6d8b5", "#d8d1a6", "#d8b1a6", "#b6a6d8"];
  
  return (
    <div className="user_list_container">

      <div className="container_markup">
        <div className="user_list_headline">Say hii to users !!</div>
      </div>

      <div className="search_user">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search_input"
        />
        <span className="search_icon">
          <img src="/Search.svg" alt="Search" />
        </span>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="list_users_containers">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user , index) => (
                <div key={user.id}>
                  <div className="template_user"   style={{  "--hover-bg": hoverColors[index % hoverColors.length] , backgroundColor: colors[index % colors.length] }} >
                    <img className="user_img" alt={user.first_name} src={user.avatar} />
                    <div className="user_details">
                      <div className="first_name_user" >{user.first_name} {user.last_name}</div>
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
