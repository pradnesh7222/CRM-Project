import React, { useState } from "react";
import "./LeadForm.scss";
import { useNavigate  } from "react-router-dom";

const LeadForm = ({isVisible,setIsVisible}) => {
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const close = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  const navigate = useNavigate();
  // Separate state for handling errors
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    status: "",
  });

  // State for storing form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    status: "",
  });

  // Handle input change and update formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the specific error if the user starts typing
    setError({
      ...error,
      [name]: "", 
    });

  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    let hasError = false;

    let newError = { 
      ...error 
    };

    // Check for empty fields
    for (const key in formData) {
      if (!formData[key]) {
        newError[key] = "This field is required";
        hasError = true;
      }
    }

    // Validate email format
    if (!emailRegex.test(formData.email)) {
      newError.email = "Invalid email format!";
      hasError = true;
    }

    // Validate phone number format
    if (!phoneRegex.test(formData.phone)) {
      newError.phone = "Invalid phone number! It should be 10 digits.";
      hasError = true;
    }

    // If there's any validation error, set the errors
    if (hasError) {
      setError(newError);
      return;
    }

    // Proceed if no errors
    console.log("Submit Data:", formData);
    navigate('/Dashboard',{ state: { formData: formData  } });
  };

  return (
  
    <div className="leadFormBg">
      <div className="leadform" >
      <form onSubmit={handleSubmit} >
        <div className="closebtn-cont">
        <h1>Enter Details</h1>
        <button id='closebtn' onClick={()=>setIsVisible(!isVisible)}><i class="ri-close-line"></i></button>
        </div>
        <span>First Name</span>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={handleInputChange}
          required
        />
        <span style={{ color: "red" }}>{error.firstName}</span>

        <span>Last Name</span>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={handleInputChange}
          required
        />
        <span style={{ color: "red" }}>{error.lastName}</span>

        <span>Email</span>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          required
        />
        <span style={{ color: "red" }}>{error.email}</span>

        <span>Phone</span>
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleInputChange}
          required
        />
        <span style={{ color: "red" }}>{error.phone}</span>

        <span>Address</span>
        <input
          type="address"
          name="address"
          placeholder="Address"
          onChange={handleInputChange}
          required
        />
        <span style={{ color: "red" }}>{error.company}</span>

        <span>Status</span>
        <select name="status" onChange={handleInputChange} required>
          <option value="">--Select an option--</option>
          <option value="New">New</option>
          <option value="Connected">Connected</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
        <span style={{ color: "red" }}>{error.status}</span>
         
        <button  type="submit" onClick={(e) => {
              handleSubmit(e);
              close(e);}
              } >Submit </button>
      </form>
    </div>
   
    </div>
  );
};

export default LeadForm;
