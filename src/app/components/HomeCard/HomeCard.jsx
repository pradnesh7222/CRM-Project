// HomeCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeCard.scss';

const HomeCard = ({ title, value, redirectUrl, filter, icon }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(redirectUrl, { state: { filter } }); // Pass filter as state
    };

    return (
      <div className='home-card' onClick={handleCardClick}>
        <h1>{title}</h1>
        <div className="card-content">
          <h2>{value}</h2>
          <i className="ri-arrow-right-up-box-fill"></i>
          {icon && <div className="card-icon">{icon}</div>}
        </div>
      </div>
    );
};

export default HomeCard;
