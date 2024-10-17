import React, { useState } from 'react';
import './NavBar.scss';
import dummy_profile from '../../Assets/dummy_profile.jpg';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/Signin";
  };

  const handleResetPassword = () => {
    console.log("Reset Password");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown
  };

  return (
    <div className="navbar">
      <div className="navbar_cont">
        <h1>CRM</h1>
        <div className="navbar_cont_profile" onClick={toggleDropdown}>
          <div className="navbar_cont_profile_circle">
            <img src={dummy_profile} alt="profile" />
          </div>
          <i className="ri-arrow-down-s-fill"></i>
          {dropdownOpen && (
            <div className="navbar_cont_profile_dropdown_menu">
              <button onClick={handleResetPassword} className='hover_effect'>Reset Password</button>
              <button onClick={handleLogout} className='hover_effect'>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
