import React, { useContext, useState } from "react";
import "./SideBar.scss";
import { Link } from "react-router-dom";
import { SidebarContext } from "../../../App";
import WorkshopLeads from "../../components/WorkshopLeads/WorkshopLeads";
import { Button, Drawer } from 'antd';
import { color } from "chart.js/helpers";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeSidebar, setActiveSidebar } = useContext(SidebarContext);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  
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

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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

        {/* Telecaller Submenu */}
        <div className="link1">
          <div className="dropdown" onClick={() => toggleSubmenu("telecaller")}>
            <div className="dropdown-inner">
              <i className="ri-customer-service-2-line"></i>
              <button className="dropbtn">Telecaller</button>
              <i className="ri-arrow-down-wide-line"></i>
            </div>
            <div className={`dropdown-content ${submenuActive["telecaller"] ? "active" : ""}`}>
              <div className="addTeleDrawer" onClick={showLoading}>Add Telecaller</div>
              <Link to="/Dashboard">Enquiry Telecaller</Link>
              <Link to="/LeadTracking">Workshop Telecaller</Link>
              
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
      <Drawer 
        closable
        destroyOnClose
        title={<p>Create Telecaller</p>}
        placement="right"
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
      >
       
        <h2>Create Telecaller</h2>
        <form>
          <label htmlFor="">Name</label>
          <input type="text" placeholder="Name" />
          <label htmlFor="">Email</label>
          <input type="text" placeholder="Email" />
          <label htmlFor="">Phone</label>
          <input type="text" placeholder="Phone"/>
          <label htmlFor="">Created At</label>
          <input type="datetime-local" />
          <label htmlFor="">Updated At</label>
          <input type="datetime-local" />
          <label htmlFor="">City</label>
          <select name="city" id="city">
          <option value="">Select a city</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Goa">Goa</option>
        
          
        </select>
        <div className="btn-cont">
        <Button
          type="primary"
          style={{
            marginBottom: 16,
          }}
          onClick={showLoading}
        >
          Submit
        </Button>

        <Button
          type="primary"
          style={{
            marginBottom: 16,
          }}
          onClick={showLoading}
        >
          Reload
        </Button>

        </div>
        
        </form>

      </Drawer>
    </div>
  );
};

export default SideBar;
