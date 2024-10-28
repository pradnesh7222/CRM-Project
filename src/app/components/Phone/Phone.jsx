import React from 'react'
import './Phone.scss'

const Phone = () => {
  return (
    <div>
       <div className="phone">
        <h1>Dial number</h1>
        <input type="Phone" placeholder='number' />
        <button>Start Call</button>
        <button id='endCall'>End call</button>
       </div>
    </div>
  )
}

export default Phone