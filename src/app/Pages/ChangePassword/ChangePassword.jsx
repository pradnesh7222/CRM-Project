import React, { useState } from 'react';
import './ChangePassword.scss';
import Navbar from '../../components/navbar/NavBar';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem('authToken');
  const handleChangePassword = async (e) => {
    e.preventDefault(); // Prevent the default form submit action

    // Validate form fields
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      alert('Please fill all the fields');
      return;
    } else if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    // Prepare data to send to the API
    const data = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      // Make the API call using fetch
      const response = await fetch('http://127.0.0.1:8000/api/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming you need to pass the authorization token in headers
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result)
      if (response.ok) {
        // If the response is successful, show success message
        setSuccess('Password changed successfully!');
        setError(null);
      } else {
        // If the response is not successful, show error message
        setError(result.detail || 'Something went wrong. Please try again.');
        setSuccess(null);
      }
    } catch (error) {
      // Catch any errors that happen during the fetch request
      setError('Failed to change password. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className='change-password'>
        <div className='change-password_cont'>
          <h1>Change Password</h1>
          {error && <p className='error-message'>{error}</p>}
          {success && <p className='success-message'>{success}</p>}
          <div className='change-password_cont_form'>
            <form>
              <label>Old Password</label>
              <input
                type='password'
                placeholder='Old Password'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <label>New Password</label>
              <input
                type='password'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label>Confirm Password</label>
              <input
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type='submit' onClick={handleChangePassword}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
