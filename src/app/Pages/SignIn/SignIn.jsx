import React, { useState } from 'react';
import './SignIn.scss';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    try {
      console.log('Sending request with data:', formData);
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('API response status:', response.status);
      const responseData = await response.json();

      if (!response.ok) {
        // If the response is not ok, set the error message
        const errors = responseData || { message: 'Network response was not ok' };
        setError(Object.values(errors).flat().join(', ')); // Display error messages
        console.log('Error from API:', errors);
        return;
      }

      console.log('API response data:', responseData);
      setSuccess('Registration successful!');
      setFormData({ username: '', email: '', password: '', password_confirm: '' });
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error signing up. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle form submission for Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

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
      const responseData = await response.json();

      if (!response.ok) {
        // If the response is not ok, set the error message
        const errors = responseData || { message: 'Failed to sign in' };
        setError(Object.values(errors).flat().join(', ')); // Display error messages
        console.log('Error from API:', errors);
        return;
      }

      console.log('Sign in successful, data:', responseData);
      setSuccess('Sign in successful!');
      setFormData({ email: '', password: '' });
      navigate('/Dashboard');
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('There was an error signing in. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
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
            type="password"
            name="password_confirm"
            placeholder="Re-type-password"
            onChange={handleInputChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Sign Up'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
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
          <span>or use your name for sign-in</span>
          <input
            type="text"
            name="username"
            placeholder="Enter your name"
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          <a href="#">Forget Your Password?</a>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
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
