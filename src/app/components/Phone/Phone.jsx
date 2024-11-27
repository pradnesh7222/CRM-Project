import React, { useState } from 'react';
import axios from 'axios';
import './Phone.scss';

const Phone = ({ handleComponentButtonClick, dateTimeRef, phoneNumberRef }) => {
  const token = localStorage.getItem('authToken');
  const [successMessage, setSuccessMessage] = useState(''); // State to manage success message

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    const data = {
      phone_number: phoneNumberRef.current.value, // Get value from ref
      date: dateTimeRef.current.value, // Get value from ref
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/contacts/', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Call scheduled successfully:', response.data);

      // Set success message
      setSuccessMessage('Call scheduled successfully!');

      // Optionally clear the form fields
      phoneNumberRef.current.value = '';
      dateTimeRef.current.value = '';

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error scheduling call:', error.response || error.message);
    }
  };

  return (
    <div>
      <div className="phone">
        <h1>Schedule Call</h1>
        <form onSubmit={handleSubmit}>
          <span>Number</span>
          <input
            type="tel"
            placeholder="Enter phone number"
            ref={phoneNumberRef} // Attach ref
            required
          />
          <span>Date and Time</span>
          <input
            type="datetime-local"
            placeholder="Date and Time"
            ref={dateTimeRef} // Attach ref
            required
          />
          <button type="submit">Schedule Call</button>
        </form>
        {/* Display success message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Phone;
