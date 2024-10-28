import React from 'react'
import './Message.scss'

const Message = () => {
  return (
    <div className="msg">
        <h1>Compose Message</h1>
        <div className="msg_cont">
            <span>Phone Number</span>
            <input type="text" placeholder='number' />
            <span>Message</span>
            <textarea name="message" id="message"></textarea>
            <button>Send</button>
        </div>
    </div>
  )
}

export default Message