import React from 'react'
import './HomeCard.scss'

const HomeCard = (props) => {
  return (
    <div className='home-card'>
      <div className="card-content">
        <h1>{props.title}</h1>
        <h2>{props.value}</h2>
        {props.icon && <div className="card-icon">{props.icon}</div>}
      </div>
    </div>
  )
}

export default HomeCard