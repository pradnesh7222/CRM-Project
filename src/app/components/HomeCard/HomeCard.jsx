import React from 'react';
import './HomeCard.scss';
import { useNavigate } from 'react-router-dom';

const HomeCard = (props) => {  // Remove redirectUrl from parameters
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (props.redirectUrl) {  // Access redirectUrl from props
      navigate(props.redirectUrl);
    }
  };

  return (
    <div className='home-card' onClick={handleRedirect}>
      <h1>{props.title}</h1>
      <div className="card-content">
        <h2>{props.value}</h2>
        <i className="ri-arrow-right-up-box-fill"></i>
        {props.icon && <div className="card-icon">{props.icon}</div>}
      </div>
    </div>
  );
}

export default HomeCard;
