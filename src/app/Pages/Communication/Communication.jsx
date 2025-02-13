import React, { useState, useEffect, useRef } from "react";
import "./Communication.scss";
import Navbar from "../../components/navbar/NavBar";
import virat from "../../Assets/viratDPjpg.jpg";
import axios from "axios";

import Phone from "../../components/Phone/Phone";
import Message from "../../components/Message/Message";
import { useParams } from "react-router-dom";
import { Segmented } from "antd";
import Email from "../../components/Email/Email";
import { Divider, Steps } from 'antd';

import { notification } from "antd";
const Communication = () => {
  const [progress, setProgress] = useState([]);
  const [leadData, setLeadData] = useState(null); // State to store lead data
  const token = localStorage.getItem("authToken"); // Retrieve token
  const { id } = useParams(); // Get id from URL params
  const [remarks, setRemarks] = useState([]);


  const [change, setChange] = useState("Call");

  const phoneNumberRef = useRef(null);
  const dateTimeRef = useRef(null);

  
  console.log( "Remarks", remarks);

  const fetchRemarks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/Get/Leads/1/Remarks/History/", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const data = await response.json();
      setRemarks(data);
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };
  
  useEffect(() => {
    fetchRemarks();
  }, [token]);  // Added dependencies if they change dynamically
  





  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/leads/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      })
      .then((response) => {
        setLeadData(response.data);
        console.log("Lead Data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching lead data:", error);
      });
  }, [id]);

  const handleComponentButtonClick = () => {
    console.log(phoneNumberRef.current.value);

    phoneNumberRef.current.value = null;
    dateTimeRef.current.value = null;
  };

  const handleConvertLeadToStudent = () => {
    if (!leadData) {
      console.error("Lead data not available.");
      return;
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
      .get(
        `http://127.0.0.1:8000/remarks-detail/by_enquiry_lead/?enquiry_lead=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);

        setProgress(response.data[0]); // Set progress data
        if (response.data[0].status) {
          // setCurrentStatus(response.data[0].status); // Update current status
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
      return progress.updated_at
        ? new Date(progress.updated_at).toLocaleDateString()
        : "N/A";
    }
    return "N/A";
  };

  return (
    <>
      
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
              <i className="ri-phone-fill"></i>
              <i className="ri-mail-line"></i>
              <i className="ri-message-2-line"></i>
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
          <h1>Student Progress Tracker</h1>
        <Divider />
    <Steps
      progressDot
      current={1}
      direction="vertical"
      items={[
        {
          title: 'Finished',
          description: 'This is a description. This is a description.',
        },
        {
          title: 'Finished',
          description: 'This is a description. This is a description.',
        },
        {
          title: 'In Progress',
          description: 'This is a description. This is a description.',
        },
        {
          title: 'Waiting',
          description: 'This is a description.',
        },
        {
          title: 'Waiting',
          description: 'This is a description.',
        },
      ]}
    />
        </div>
      </div>
    </>
  );
};

export default Communication;
