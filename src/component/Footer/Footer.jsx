import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './footer.scss'; // Import the CSS file

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail(''); // Clear the input field after submission
    } else {
      toast.error('Please enter a valid email address.');
    }
  };

  return (
    <footer className="footer">
      <div className="section">
        <div className='newsletter_headline'>About Us</div>
        <p>We are committed to providing the best service possible.</p>
        <p>Our team is dedicated to delivering high-quality products.</p>
        <p>Founded in 2024, we aim to innovate and inspire.</p>
        <p>Copyright@2024 ReqRes API</p>
      </div>
      <div className="section">
        <div className='newsletter_headline'>Contact Us</div>
        <p>Email: archit@gmail.com</p>
        <p>Phone: +91 8756471609</p>
        <p>Address: 123 Example St, Noida, India</p>
        <p>Follow us on social media for updates!</p>
      </div>
      <div className="section">
        <div className='newsletter_headline'>Newsletter Subscription</div>
        <form className ="newletter_submit" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="newsletter-input"
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
      <ToastContainer />
    </footer>
  );
};

// Export the Footer component
export default Footer;
