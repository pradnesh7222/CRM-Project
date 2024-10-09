import React, { useState } from "react";
import './SignUp.scss';
import SignUp_Poster from '../../Assets/SignUp_poster.jpg';

const SignUp = () => {
  // State variables for form inputs
  const [formData, setFormData] = useState({
    User_Name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { User_Name, email, password, confirm_password } = formData;

    // Basic validation
    if (!User_Name || !email || !password || !confirm_password) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    // Clear the error and proceed (e.g., send form data to an API)
    setError('');
    console.log('Form Submitted:', formData);
    // You can add API calls or further logic here
  };

  return (
    <div className="signup">
      <div className="signup_left">
        <img src={SignUp_Poster} alt="poster" />
      </div>

      <div className="signup_right">
        <h2>Sign Up</h2>
        <legend>
        <form onSubmit={handleSubmit}>
          <div>
            <label>User Name:</label>
            <input
              type="text"
              placeholder="User Name"
              name="User_Name"
              value={formData.User_Name}
              onChange={handleChange}
              // required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              placeholder="rishi.......@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              // required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="*************"
              name="password"
              value={formData.password}
              onChange={handleChange}
              // required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="*************"
              value={formData.confirm_password}
              onChange={handleChange}
              // required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="button-cont">
          <button type="submit">Sign Up</button>
          <button type="submit">Login</button>
          </div>
        </form>
        </legend>
      </div>
    </div>
  );
};

export default SignUp;
