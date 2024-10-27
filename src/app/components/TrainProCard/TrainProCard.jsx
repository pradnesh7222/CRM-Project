import React from 'react';
import './TrainProCard.scss';

const TrainProCard = ({ img, title, description, duration, fee, instructor, redirect, courseId }) => {
  const handleEnroll = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/enroll/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`  // Include token if using token authentication
        },
        body: JSON.stringify({ course_id: courseId })
      });

      if (!response.ok) {
        throw new Error('Enrollment failed');
      }

      const data = await response.json();
      console.log('Enrollment successful:', data);
      // Optionally update UI or notify user
    } catch (error) {
      console.error('Error enrolling student:', error);
    }
  };

  return (
    <div className="TrainProCard">
      <div className="TrainProCard_Cont">
        <img src={img} alt="course" /> {/* Update alt text for better accessibility */}
        <h1>{title}</h1>
        <p>{description}</p>
        <h3>Duration: {duration}</h3>
        <h3>Fee: {fee}</h3>
        <h3>Instructor: {instructor}</h3>

        <div className="TrainProCard_Btn">
          <a href={redirect} target="_blank" rel="noopener noreferrer"> {/* Added rel for security */}
            <button>View Details</button>
          </a>
          <button onClick={handleEnroll}>Enroll Now</button>
        </div>
      </div>
    </div>
  );
}

export default TrainProCard;
