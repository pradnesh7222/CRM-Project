import React, { useContext, useState } from "react";
import "./SideBar.scss";
import { Link } from "react-router-dom";
import { SidebarContext } from "../../../App";
import { Button, Drawer, message } from 'antd';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeSidebar, setActiveSidebar } = useContext(SidebarContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');
  const [submenuActive, setSubmenuActive] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    location: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone_number: "",
    location: "",
  });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setActiveSidebar(activeSidebar === "" ? "toggleSidebar" : "");
  };

  const toggleSubmenu = (submenu) => {
    setSubmenuActive((prevState) => ({
      ...prevState,
      [submenu]: !prevState[submenu],
    }));
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      name: "",
      email: "",
      phone_number: "",
      location: "",
    };

    if (!formData.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Phone number validation (basic example: 10 digits)
    const phonePattern = /^\d{10}$/;
    if (!formData.phone_number || !phonePattern.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid 10-digit phone number.";
      isValid = false;
    }

    if (!formData.location) {
      newErrors.location = "Location is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/create_enquiry_telecaller/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success("Telecaller created successfully!");
        setFormData({ name: "", email: "", phone_number: "", location: "" });
        setOpen(false);
      } else {
        message.error("Failed to create telecaller.");
      }
    } catch (error) {
      console.error("Error creating telecaller:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const places = [
    { value: "", name: 'Select an option' },
    { value: 'Bengaluru', name: 'ETA Mall Bangalore' },
    { value: 'Mumbai', name: 'Andheri Mumbai' },
    { value: 'Goa', name: 'Panaji GOA' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar_left">
        <i className="ri-arrow-left-double-line" onClick={toggleSidebar}></i>

        <div className="link1">
          <i className="ri-home-4-line"></i>
          {!isCollapsed && <Link to="/Home">Home</Link>}
        </div>

        <div className="link1">
          <div className="dropdown" onClick={() => toggleSubmenu("leads")}>
            <div className="dropdown-inner">
              <i className="ri-customer-service-line"></i>
              <button className="dropbtn">Leads</button>
              <i className="ri-arrow-down-wide-line"></i>
            </div>
            <div className={`dropdown-content ${submenuActive["leads"] ? "active" : ""}`}>
              <Link to="/Dashboard">Enquiry Leads</Link>
              <Link to="/WorkshopLeads">Workshop Leads</Link>
            </div>
          </div>
        </div>

        <div className="link1">
          <div className="dropdown" onClick={() => toggleSubmenu("telecaller")}>
            <div className="dropdown-inner">
              <i className="ri-customer-service-2-line"></i>
              <button className="dropbtn">Telecaller</button>
              <i className="ri-arrow-down-wide-line"></i>
            </div>
            <div className={`dropdown-content ${submenuActive["telecaller"] ? "active" : ""}`}>
              <div className="addTeleDrawer" onClick={showLoading}>Add Telecaller</div>
              <Link to="/EnquiryTele">Enquiry Telecaller</Link>
              <Link to="/WorkShopTele">Workshop Telecaller</Link>
            </div>
          </div>
        </div>

        <div className="link1">
          <i className="ri-product-hunt-line"></i>
          {!isCollapsed && <Link to="/Courses">Courses</Link>}
        </div>
        <div className="link1">
          <i className="ri-graduation-cap-line"></i>
          {!isCollapsed && <Link to="/StudentTable">Students</Link>}
        </div>
        <div className="link1">
          <i className="ri-pen-nib-line"></i>
          {!isCollapsed && <Link to="/EnrolleTable">Enrolled</Link>}
        </div>
        <div className="link1">
  <div className="dropdown" onClick={() => toggleSubmenu("assignedLeads")}>
    <div className="dropdown-inner">
      <i className="ri-customer-service-2-line"></i>
      <button className="dropbtn">Assigned Leads</button>
      <i className="ri-arrow-down-wide-line"></i>
    </div>
    <div
      className={`dropdown-content ${submenuActive["assignedLeads"] ? "active" : ""}`}
    >
     
      <Link to="/TeleCallerPage">Assigned Enquiry Leads</Link>
      <Link to="/WorkshopTelecallerPage">Assigned Workshop Leads</Link>
    </div>
  </div>
</div>

      </div>
      

      <Drawer 
        title="Create Telecaller"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
      >
        <form>
          <TextField 
            name="name" 
            label="Name" 
            variant="outlined" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your name" 
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField 
            name="email" 
            label="Email" 
            variant="outlined" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter your email"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField 
            name="phone_number" 
            label="Phone" 
            variant="outlined" 
            value={formData.phone_number} 
            onChange={handleChange} 
            placeholder="Enter your phone number"  
            error={!!errors.phone_number}
            helperText={errors.phone_number}
          />
          <TextField 
            name="location" 
            select 
            label="Location" 
            variant="outlined" 
            value={formData.location} 
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
          >
            {places.map((place) => (
              <MenuItem key={place.value} value={place.value}>
                {place.name}
              </MenuItem>
            ))}
          </TextField>
          
          <div className="btn-cont">
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Submit
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default SideBar;
