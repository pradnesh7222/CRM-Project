import React, { useState, useEffect, useRef } from "react";
import "./Communication.scss";
import Navbar from "../../components/navbar/NavBar";
import Email from "../../components/Email/Email";
import virat from "../../Assets/viratDPjpg.jpg";
import Phone from "../../components/Phone/Phone";
import Message from "../../components/Message/Message";
import axios from "axios";
import { Steps } from "antd";
import { useParams } from "react-router-dom";

import { Alert } from "antd";
import {  notification } from "antd";
const description = "";
const Communication = () => {
  const [progress, setProgress] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [displayComponent, setDisplayComponent] = useState("phone");
  const [leadData, setLeadData] = useState(null); // State to store lead data
  const token = localStorage.getItem("authToken"); // Retrieve token
  const { id } = useParams(); // Get id from URL params
  const statusMapping = {
    "Pending": 0,
    "Contacted": 1,
    "Follow Up": 2,
    "Converted": 3,
    "Closed": 4,
  };
  const phoneNumberRef = useRef(null);
  const dateTimeRef = useRef(null);
  const progressSteps = Object.values(progress);  // Convert the object to an array of values

  // Fetch lead data when the component mounts or id changes
  useEffect(() => {
    // console.log("Lead ID:", id); // Check if id is correctly received
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
    console.log(phoneNumberRef.current.value);

    phoneNumberRef.current.value = null;
    dateTimeRef.current.value = null;
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
      .post("http://127.0.0.1:8000/ConversionofLeadToStudents/", data, {
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
  

  // Fetch lead data and progress tracking data
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/leads/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLeadData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lead data:", error);
      });

    // Fetch progress data
    axios
      .get(`http://127.0.0.1:8000/remarks-detail/by_enquiry_lead/?enquiry_lead=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        
        setProgress(response.data[0]); // Set progress data
        if (response.data[0].status) {
          setCurrentStatus(response.data[0].status); // Update current status
        }
      })
      .catch((error) => {
        console.error("Error fetching progress data:", error);
      });
  }, [id]);
  const getDateForStatus = (status) => {
    if (Array.isArray(progress)) {
      const remark = progress.find((remark) => remark.status === status);
      return remark ? new Date(remark.updated_at).toLocaleDateString() : "N/A";
    } else if (progress && progress.status === status) {
      // If progress is an object with a status field
      return progress.updated_at ? new Date(progress.updated_at).toLocaleDateString() : "N/A";
    }
    return "N/A";
  };
  
  const showReminders = () => {
    const reminders = [
      `Follow up with lead on ${
        progress && progress.updated_at
          ? new Date(progress.updated_at).toLocaleDateString()
          : "an unspecified date"
      }`,
    ];
    

    reminders.forEach((reminder, index) => {
      setTimeout(() => {
        notification.info({
          message: "Reminder",
          description: reminder,
          placement: "topRight",
        });
      }, index * 1000);
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
              <i
                className="ri-phone-fill"
                onClick={() => setDisplayComponent("phone")}
              ></i>
              <i
                className="ri-mail-line"
                onClick={() => setDisplayComponent("Email")}
              ></i>
              <i
                className="ri-message-2-line"
                onClick={() => setDisplayComponent("msg")}
              ></i>
              <a href="https://wa.me/918904116759" target="blank">
                <i className="ri-whatsapp-line"></i>
              </a>
            </div>
            <button onClick={handleConvertLeadToStudent}>
              Convert Lead to student
            </button>
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
              <button onClick={handleComponentButtonClick}>Clear</button>
              {displayComponent === "phone" && (
                <Phone
                  handleComponentButtonClick={handleComponentButtonClick}
                  phoneNumberRef={phoneNumberRef}
                  dateTimeRef={dateTimeRef}
                />
              )}
              {displayComponent === "Email" && <Email />}
              {displayComponent === "msg" && <Message />}
            </div>
            <div className="com_right_up_reminder">
  <h1 >Reminder</h1>
  <div className="alarm-container">
    <div className="alarm-bell">
      <div className="bell-top"></div>
      <div className="bell-body"></div>
      <div className="bell-clapper"></div>
    </div>
  </div>
  <Alert
    message="Show Reminder"
    type="success"
    onClick={showReminders}
    style={{ width: "70%", textAlign: "center", margin: "auto" }}
  />
</div>

          </div>
          <div className="com_right_history" style={{ padding: "2vw" }}>
  <h1>Progress Tracking</h1>
      {currentStatus ? (
        <Steps
          direction="horizontal"
          size="large"
          current={statusMapping[currentStatus]} // Map status to step
          items={[
            {
              title: "Pending",
              description: getDateForStatus("Pending"),
            },
            {
              title: "Contacted",
              description: getDateForStatus("Contacted"),
            },
            {
              title: "Follow Up",
              description: getDateForStatus("Follow Up"),
            },
            {
              title: "Converted",
              description: getDateForStatus("Converted"),
            },
            {
              title: "Closed",
              description: getDateForStatus("Closed"),
            },
          ]}
        />
      ) : (
        <p>Loading progress...</p>
      )}
</div>
     </div>
      </div>
    </>
  );
};

export default Communication;
