import React, { useState } from 'react';
import './SignIn.scss';

const SignIn = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isActive) {
      setSignUpData({
        ...signUpData,
        [name]: value,
      });
    } else {
      setSignInData({
        ...signInData,
        [name]: value,
      });
    }
    setError('');
  };

  const handleRegister = () => {
    setIsActive(true);
  };

  const handleLogin = () => {
    setIsActive(false);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (signUpData.password !== signUpData.password_confirm) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(signUpData.password)) {
      setError('Password should contain at least 8 characters, including 1 letter and 1 symbol');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(signUpData.email)) {
      setError('Invalid email format!');
      setLoading(false);
      return;
    }

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

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Sending signin data to the API
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signInData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to login');
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('Login successful:', result);
      setSuccess(true);
      setError('');
    } catch (error) {
      console.error('Error during sign in:', error);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
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
            {error && <p className='validpass' style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="ri-google-fill "></i></a>
              <a href="#" className="icon"><i className="ri-facebook-box-fill"></i></a>
              <a href="#" className="icon"><i className="ri-github-fill"></i></a>
              <a href="#" className="icon"><i className="ri-linkedin-box-fill"></i></a>
            </div>
            <span>or use your email for sign-in</span>
            <input
              type="username"
              name="username"
              placeholder="username"
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
            {error && <p className='validpass' style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>
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
