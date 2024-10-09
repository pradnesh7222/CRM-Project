import React, { useState } from 'react';
import './SignIn.scss';

const SignIn = () => {
  // State to handle the active class toggle
  const [isActive, setIsActive] = useState(false);

  // State to handle form data for Sign In and Sign Up
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle registration (add active class)
  const handleRegister = () => {
    setIsActive(true);
  };

  // Function to handle login (remove active class)
  const handleLogin = () => {
    setIsActive(false);
  };

  // Handle form submission for Sign Up
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // Log the form data to the console
    console.log('Sign Up Data:', formData);
  };

  // Handle form submission for Sign In
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    // Log the form data to the console
    console.log('Sign In Data:', formData);
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="ri-google-fill"></i></a>
            <a href="#" className="icon"><i className="ri-facebook-box-fill"></i></a>
            <a href="#" className="icon"><i className="ri-github-fill"></i></a>
            <a href="#" className="icon"><i className="ri-linkedin-box-fill"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            name="username"
            placeholder="Name"
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
           <input
            type="Re-type-password"
            name="password_confirm"
            placeholder="re-type-password"
            onChange={handleInputChange}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="ri-google-fill"></i></a>
            <a href="#" className="icon"><i className="ri-facebook-box-fill"></i></a>
            <a href="#" className="icon"><i className="ri-github-fill"></i></a>
            <a href="#" className="icon"><i className="ri-linkedin-box-fill"></i></a>
          </div>
          <span>or use your email for sign-in</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          <a href="#">Forget Your Password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site's features</p>
            <button className="hidden" id="login" onClick={handleLogin}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">

            <h1>CRM Login</h1>
            <h1>Welcome, Friend!</h1>
            <p>Enter your personal details to use all of the site's features</p>
            <button className="hidden" id="register" onClick={handleRegister}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
