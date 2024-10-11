import React, { useState } from 'react';
import './SignIn.scss';

const SignIn = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData,setFormData] = useState('');
  
  
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });

  const [error, setError] = useState('');
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = () => {
    setIsActive(true);
  };

  const handleLogin = () => {
    setIsActive(false);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      console.log('Sending request with data:', formData);
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Network response was not ok');
        console.log('Error from API:', errorData);
        return;
      }

      const data = await response.json();
      console.log('API response data:', data);
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

    // Sending signup data to the API
    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register');
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('Registration successful:', result);
      setSuccess(true);
      setError('');
    } catch (error) {
      console.error('Error during sign up:', error);
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
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
