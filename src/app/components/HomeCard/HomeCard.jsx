import React from 'react'
import './HomeCard.scss'

const HomeCard = (props) => {
  return (
    <div className='home-card'>
      
        <h1>{props.title}</h1>
        <div className="card-content">
        <h2>{props.value}</h2>
        <i class="ri-arrow-right-up-box-fill"></i>
        {props.icon && <div className="card-icon">{props.icon}</div>}
      </div>
    </div>
  )
}

export default HomeCard