import React, { useState } from 'react';
import './SignIn.scss';

const SignIn = () => {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });

<<<<<<< HEAD
  // State for error message
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
=======
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
>>>>>>> abda1f60b89ad4da9b01019eed228ccbb45cd5d3

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(''); // Clear error message on input change
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
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    
    
    // Check if passwords match
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match!');
      return;
    }

    // console.log('Sign Up Data:', formData);
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format!');
      return;
    }
    // Log the form data to the console if passwords match
    console.log('Sign Up Data:', formData);
  };

  

  // Handle form submission for Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      console.log('Sending sign-in request with data:', { username: formData.username, password: formData.password });
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      console.log('API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to sign in');
        console.log('Error from API:', errorData);
        return;
      }

      const data = await response.json();
      console.log('Sign in successful, data:', data);
      setSuccess('Sign in successful!');
      setFormData({ email: '', password: '' });
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('There was an error signing in. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <main>
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
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password_confirm"
              placeholder="Re-type Password"
              onChange={handleInputChange}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
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
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              required
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
              <h1>Welcome, Friend!</h1>
              <p>Enter your personal details to use all of the site's features</p>
              <button className="hidden" id="register" onClick={handleRegister}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
