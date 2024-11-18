import React, { useState, useEffect } from "react";
import "./Communication.scss";
import Navbar from "../../components/navbar/NavBar";
import Email from "../../components/Email/Email";
import virat from "../../Assets/viratDPjpg.jpg";
import Phone from "../../components/Phone/Phone";
import Message from "../../components/Message/Message";
import axios from "axios";
import { useParams } from "react-router-dom";

const Communication = () => {
  const [displayComponent, setDisplayComponent] = useState(null);
  const [leadData, setLeadData] = useState(null); // State to store lead data
  const token = localStorage.getItem('authToken'); // Retrieve token
  const { id } = useParams(); // Get id from URL params

  // Fetch lead data when the component mounts or id changes
  useEffect(() => {
    console.log("Lead ID:", id); // Check if id is correctly received
    axios
    .get(`http://127.0.0.1:8000/leads/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to Authorization header
      },
    })
      .then((response) => {
        setLeadData(response.data); // Store the lead data in state
        console.log("Lead Data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching lead data:", error);
      });
  }, [id]); // Run the effect when id changes

  const handleIconClick = (component) => {
    setDisplayComponent(component);
  };

  const handleComponentButtonClick = () => {
    setDisplayComponent(null);
  };

  const handleConvertLeadToStudent = () => {
    if (!leadData) {
      console.error("Lead data not available.");
      return; // Prevent sending data if leadData is not yet loaded
    }

    const data = {
      id: leadData.id, // Use leadData to get the id
      assigned_to_user: "1", // Assign the user ID as needed
      name: leadData.name, // Use leadData.name
      email: leadData.email, // Use leadData.email
      phone_number: leadData.phone_number, // Use leadData.phone_number
      course: leadData.course, // Use leadData.course
    };

    axios
      .post("http://127.0.0.1:8000/Convert_lead_to_student/", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header
        },
      })
      .then((response) => {
        console.log("Lead converted to student:", response.data);
        // Additional logic, like showing a success message
      })
      .catch((error) => {
        console.error("Error converting lead:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="com">
        <div className="com_left">
          <div className="top">
            <i className="ri-arrow-left-s-line"></i>
            <i className="ri-notification-fill"></i>
          </div>
          <div className="com_left_profile">
            <div className="com_left_profile_dp">
              <img src={virat} alt="DP.img" />
            </div>
            <h1>{leadData ? leadData.name : "Loading..."}</h1>
            <div className="com_left_profile_iconCont">
              <i className="ri-phone-fill" onClick={() => handleIconClick(<Phone />)}></i>
              <i className="ri-mail-line" onClick={() => handleIconClick(<Email />)}></i>
              <i className="ri-message-2-line" onClick={() => handleIconClick(<Message />)}></i>
              <a href="https://wa.me/918904116759" target="_blank">
                <button className="ri-whatsapp-fill"></button>
              </a>
            </div>
            <button onClick={handleConvertLeadToStudent}>Convert Lead to student</button>
          </div>
          <div className="com_left_info">
            <h3>Lead Info</h3>
            <div className="bind">
              <label htmlFor="email">Email</label>
              <h4>{leadData ? leadData.email : "Loading..."}</h4>
            </div>
            <div className="bind">
              <label htmlFor="LeadID">LeadID</label>
              <h4>{leadData ? leadData.id : "Loading..."}</h4>
            </div>
            <div className="bind">
              <label htmlFor="Phone">Phone</label>
              <h4>{leadData ? leadData.phone_number : "Loading..."}</h4>
            </div>
            <div className="bind">
              <label htmlFor="course_name">Course</label>
              <h4>{leadData ? leadData.course_name : "Not provided"}</h4>
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
              <h1>Reminder</h1>
            </div>
          </div>
          <div className="com_right_history"></div>
        </div>
      </div>
    </>
  );
};

export default Communication;
