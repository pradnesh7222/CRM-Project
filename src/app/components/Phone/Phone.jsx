import React from 'react'
import './Phone.scss'

const Phone = () => {
  return (
    <div>
       <div className="phone">
        <h1>Schedule Call</h1>
        <span>Number</span>
        <input type="Phone" placeholder='number' />
        <span>Date and Time</span>
        <input type="datetime-local" placeholder='Date and Time' />
        <button>Schedule Call</button>
       
       </div>
    </div>
  )
}

export default Phone