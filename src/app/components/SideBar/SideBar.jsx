import React from "react";
import "./SideBar.scss";
// import { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
 


  return (
    <>
     
      <div className="sidebar">
        <div className="sidebar_left">
          <div className="link1">
            <Link to="/Home">Home</Link>
          </div>
          <div className="link1">
            <Link to="/Dashboard">Leads</Link>
          </div>
          <div className="link1">
          <Link to='/Courses'>Courses</Link>
          </div>
          <div className="link1">
            <Link to="/StudentTable">Students</Link>
          </div>
          <div className="link1">
            <Link to="">Enrolled Student</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
