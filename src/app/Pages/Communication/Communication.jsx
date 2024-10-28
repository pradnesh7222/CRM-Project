import React, { useState } from "react";
import "./Communication.scss";
import Navbar from "../../components/navbar/NavBar";
import Email from "../../components/Email/Email";
import virat from "../../Assets/viratDPjpg.jpg"
import Phone from "../../components/Phone/Phone"
import Message from "../../components/Message/Message";

const Communication = () => {
  const [displayComponent, setDisplayComponent] = useState(null);

  const handleIconClick = (component) => {
    setDisplayComponent(component);
  };

  const handleComponentButtonClick = () => {
    setDisplayComponent(null);
  };

  return (
    <>
      <Navbar />
      <div className="com">
        <div className="com_left">
         <div className="top">
        <i class="ri-arrow-left-s-line"></i>
        <i class="ri-notification-fill"></i>
        </div>
          <div className="com_left_profile">
            <div className="com_left_profile_dp">
                <img src={virat} alt="" />
            </div>
            <h1>Virat Kohli</h1>
            <div className="com_left_profile_iconCont">
              <i class="ri-phone-fill" onClick={() => handleIconClick(<Phone />)}></i>
              <i class="ri-mail-line" onClick={() => handleIconClick(<Email />)}></i>
              <i class="ri-message-2-line" onClick={() => handleIconClick(<Message />)}></i>
              <i class="ri-whatsapp-fill"></i>
            </div>
            <button>Convert Lead to student</button>

          </div>
          <div className="com_left_info">
            <h3>Lead Info</h3>
            <div className="bind">
            <label htmlFor="email">Email</label>
            <h4>Lead_email</h4>
            </div>
            <div className="bind">
            <label htmlFor="LeadID">LeadID</label>
            <h4>LeadID</h4>
            </div>
            <div className="bind">
            <label htmlFor="Phone">Phone</label>
            <h4>8934275689</h4>
            </div>
            <div className="bind">
            <label htmlFor="Education">Education</label>
            <h4>Btch</h4>
            </div>
            <div className="bind">
            <label htmlFor="Passing year">Passing year</label>
            <h4>2022</h4>
            </div>
          </div>
        </div>
        <div className="com_right">
            <div className="com_right_up">
                
            <div className="com_right_up_action">
            {displayComponent && <button onClick={handleComponentButtonClick}>Clear</button>}
            {displayComponent}
              
            </div>
            <div className="com_right_up_reminder">
                <h1>reminder</h1>
            </div>
            </div>
            <div className="com_right_history">
               
            </div>
        </div>
      </div>
    </>
  );
};

export default Communication;
