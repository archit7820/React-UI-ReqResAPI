import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// login sidebar Image section
const images = [
  {
    src: "login_img_3.jpg",
    alt: "Image 1",
    text: "The only way to do great work is to love what you do. If you haven’t found it yet, keep looking; don’t settle.",
    logo: "logo_reqres.svg",
  },
  {
    src: "login_img_2.jpg",
    alt: "Image 2",
    text: "In the corporate world, innovation is key. Don’t just think outside the box; create a new box!",
    logo: "logo_reqres.svg",
  },
  {
    src: "login_img_1.jpg",
    alt: "Image 3",
    text: "The only way to do great work is to love what you do. If you haven’t found it yet, keep looking; don’t settle",
    logo: "logo_reqres.svg",
  },
  {
    src: "login_img_4.jpg",
    alt: "Image 4",
    text: "In the corporate world, innovation is key. Don’t just think outside the box; create a new box!",
    logo: "logo_reqres.svg",
  },
];
const Create = () => {
  const [email, setEmail] = useState("");   // state for email
  const [password, setPassword] = useState(""); //state for password
  const navigate = useNavigate(); // navigate to another page
  const [currentIndex, setCurrentIndex] = useState(0); // state for current index of image
  const [error, setError] = useState("");  // state for error message
  const [acceptedTerms, setAcceptedTerms] = useState(false);  // state for terms and condition

  // next image function for login sidebar
  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  // prev image function for login sidebar
  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };


  // submit function for create account 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if terms are accepted
    if (!acceptedTerms) {
        toast.error("Please accept the Terms of Service and Privacy Policy.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return; // Prevent submission if terms are not accepted
      }

    try {
      //user axios to post data to API
      const response = await axios.post("https://reqres.in/api/register", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
// notification for successful account creation
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        navigate("/UserList");
      }, 2000);
    } catch (err) {
      if (err.response) {
        const statusCode = err.response.status;

        // Handle different error status codes
        if (statusCode === 400) {
          toast.error("Bad Request. Please Create an account with API Documented Credentials", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (statusCode === 401) {
          toast.error("Unauthorized. Please check your credentials.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (statusCode === 500) {
          toast.error("Server error. Please try again later.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error(`Error: ${statusCode}. Please try again.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } else {
        // Handle network or other errors
        toast.error("Network error. Please check your connection.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  return (
   
    <div className="login_container">
          <div className="image_container">
             {images.map((image, index) => (
          <div
            className={`login_img ${index === currentIndex ? "active" : "inactive"}`}
            key={index}
          >
            <img src={image.src} alt={image.alt} />
            <div className="overlay">
              <img src={image.logo} alt="Logo" className="logo"  style={{width  :"200px"}}/>
              <div className="text_headline">{image.text}</div>
              <div className="button_container">
                <button onClick={handlePrevImage} className="change_button">
                   <img className="arrow" src ="./arrow-left.svg" alt=""/>
                </button>
                <button onClick={handleNextImage} className="change_button">
                <img className="arrow" src ="./arrow-right.svg" alt=""/>
                </button>
              </div>
            </div>
           </div>
        ))}
      </div>

      <div className="form_container">
        <div className="login_headline">
          Create Your Account
          <div className="create_account"  style={{ textShadow :"none"}}>
            Already have an account?{" "}
            <span>
              <Link to="/"  style={{ color: "#168700" }}>
                Login your account
              </Link>
            </span>
          </div>
        </div>

        <form className="form_input_section" onSubmit={handleSubmit}>
          <div className="login_section">
            <div className="input_email">
              <div className="input_parameter">Email</div>
              <input
                type="email"
                placeholder="Enter your email"
                id="login_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input_password">
              <div className="input_parameter">Password</div>
              <input
                id="login_password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="terms_login">
            <div className="terms_section">
              <input
                type="checkbox"
                id="accept_terms"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
              />
              <label htmlFor="accept_terms">
              By clicking continue, you agree to our{" "}
                <a href="/terms" target="_blank">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              className="login_button"
              type="submit"
              style={{ fontSize: "1rem" }}
              //disabled={!acceptedTerms}
            >
              Create your Account
            </button>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
};

export default Create;
