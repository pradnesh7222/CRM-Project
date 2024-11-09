import React, { useState } from 'react'
import './Email.scss'

const Email = () => {
  const [toEmail, setToEmail] = useState('');
  const [ccEmail, setCCEmail] = useState('');
  const [bccEmail, setBCCEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSend = () => {
    if (!validateEmail(toEmail)) {
      setError('Invalid email address');
    } else if (!validateEmail(ccEmail)) {
      setError('Invalid "CC" email address');
    } else if (!validateEmail(bccEmail)) {
      setError('Invalid "BCC" email address');
    } else {
      setError('');
      // Add logic to send email
    }
  };

  return (
    <div className="email">
        <h1>Compose Email</h1>
        <div className="email_inner">
            <div className="emailBind">
                <span>To :</span>
                <input type="text" placeholder='email' value={toEmail} onChange={(e) => setToEmail(e.target.value)}/>
            </div>
           
            <div className="emailBind">
                <span>Message:</span>
                <textarea name="message" id="email_message" placeholder='write your message here' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            </div>
            <button onClick={handleSend}>Send</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    </div>
  )
}

export default Email