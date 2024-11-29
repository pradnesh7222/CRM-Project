import React, { useState } from 'react';
import './Email.scss';

const Email = () => {
  const [toEmail, setToEmail] = useState('');
  const [ccEmail, setCCEmail] = useState('');
  const [bccEmail, setBCCEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://127.0.0.1:8000/api/Communication/EmailSend/';
  const token = localStorage.getItem('authToken'); // Replace with your actual token

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSend = async () => {
    if (!validateEmail(toEmail)) {
      setError('Invalid email address');
      return;
    } else if (ccEmail && !validateEmail(ccEmail)) {
      setError('Invalid "CC" email address');
      return;
    } else if (bccEmail && !validateEmail(bccEmail)) {
      setError('Invalid "BCC" email address');
      return;
    } else {
      setError('');
    }

    const emailData = {
      to: toEmail,
      cc: ccEmail,
      bcc: bccEmail,
      message,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccess('Email sent successfully!');
        setToEmail('');
        setCCEmail('');
        setBCCEmail('');
        setMessage('');
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.detail || 'Failed to send email'}`);
      }
    } catch (err) {
      setError('An error occurred while sending the email');
    }
  };

  return (
    <div className="email">
      <h1>Compose Email</h1>
      <div className="email_inner">
        <div className="emailBind">
          <span>To :</span>
          <input
            type="text"
            placeholder="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
          />
        </div>
    
  
        <div className="emailBind">
          <span>Message:</span>
          <textarea
            name="message"
            id="email_message"
            placeholder="Write your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button onClick={handleSend}>Send</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </div>
    </div>
  );
};

export default Email;
