import React, { useRef } from 'react';
import axios from 'axios';
import './Phone.scss';

const Phone = ({handleComponentButtonClick, dateTimeRef, phoneNumberRef}) => {
  // console.log(handleComponentButtonClick());
  
  // const phoneNumberRef = useRef(null);
  // const dateTimeRef = useRef(null);

  // handleComponentButtonClick(phoneNumberRef, dateTimeRef)

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    const data = {
      number: phoneNumberRef.current.value, // Get value from ref
      dateTime: dateTimeRef.current.value, // Get value from ref
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/communications/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Call scheduled successfully:', response.data);
      // Optionally clear the form fields
      phoneNumberRef.current.value = '';
      dateTimeRef.current.value = '';
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
      </div>
    </div>
  );
};

export default Phone;
