import React from 'react'
import './TrainProCard.scss'




const TrainProCard = ({img, title, description, duration, fee, instructor}) => {



  return (
    <div className="TrainProCard">
        <div className="TrainProCard_Cont">
            <img src={img} alt="course.img" />
            <h1>{title}</h1>
            <p>{description}</p>
             <h3>Duration: {duration}</h3>
             <h3>Fee: {fee}</h3>
             <h3>Instructor: {instructor}</h3>

             <div className="TrainProCard_Btn">
            <button>View Details</button>
            <button>Enroll Now</button>
             </div>
        </div>

    </div>
  )
}

export default TrainProCard