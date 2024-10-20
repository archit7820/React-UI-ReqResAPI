import React, { useEffect, useState } from 'react';
import './navbar.scss'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook for navigation

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = () => { 
    localStorage.removeItem("token");
    localStorage.removeItem("email") ;
    sessionStorage.removeItem("email") ;
    navigate("/"); // Use navigate function to programmatically navigate
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the width threshold as needed
    };

    // Run on component mount
    handleResize();

    // Add window resize listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <nav className="navbar">
      <div className="logo_navbar"> {isMobile ? (
        <img src="/mobile_logo.svg" alt="Mobile Logo" />
      ) : (
        <img src="/navabar_logo.svg" alt="Web Logo" />
      )}</div>
      <div className="random-data">
        <div className='about_us'> About Us </div> 
        <div className='about_us'> Contact </div> 
        <div className='about_us'> Services </div> 
      </div>
      <div className="menu-button" onClick={toggleMenu}>
        <div className={`circle ${menuOpen ? 'open' : ''}`}>
          <img className='navbar_menu' src="/navbar_menu.svg" alt="" />
        </div>
      </div>
      {menuOpen && (
        <div className="dropdown-menu">
          <div style={{color : 'green'}}> ReqRes API</div>
          <div>{localStorage.getItem('email_assignment')}</div> 
          <div className='logout' onClick={logout}>Logout</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
