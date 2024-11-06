import React, { useContext, useState } from "react";
import "./SideBar.scss";
import { Link } from "react-router-dom";
import { SidebarContext } from "../../../App";
import WorkshopLeads from "../../components/WorkshopLeads/WorkshopLeads";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeSidebar, setActiveSidebar } = useContext(SidebarContext);
  
  // Update to track each submenu by a unique identifier
  const [submenuActive, setSubmenuActive] = useState({});

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setActiveSidebar(activeSidebar === "" ? "toggleSidebar" : "");
  };

  // Toggle specific submenu
  const toggleSubmenu = (submenu) => {
    setSubmenuActive((prevState) => ({
      ...prevState,
      [submenu]: !prevState[submenu],
    }));
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar_left">
        <i className="ri-arrow-left-double-line" onClick={toggleSidebar}></i>
        
        <div className="link1">
          <i className="ri-home-4-line"></i>
          {!isCollapsed && <Link to="/Home">Home</Link>}
        </div>

        {/* Leads Submenu */}
        <div className="link1">
          <div className="dropdown" onClick={() => toggleSubmenu("leads")}>
            <div>
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

        {/* Telecaller Submenu */}
        <div className="link1">
          <div className="dropdown" onClick={() => toggleSubmenu("telecaller")}>
            <div>
              <i className="ri-customer-service-2-line"></i>
              <button className="dropbtn">Telecaller</button>
              <i className="ri-arrow-down-wide-line"></i>
            </div>
            <div className={`dropdown-content ${submenuActive["telecaller"] ? "active" : ""}`}>
              <Link to="/Dashboard">Enquiry Leads</Link>
              <Link to="/LeadTracking">Workshop Leads</Link>
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
      </div>
    </div>
  );
};

export default SideBar;
