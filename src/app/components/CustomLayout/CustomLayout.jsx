import React from "react";
import "./CustomLayout.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../SideBar/SideBar";

export const CustomLayout = ({children}) => {
  return (
    <div className="layout">
      <div className="layout_header">
        <Navbar />
      </div>
      <div className="layout_section">
        <div className="layout_section_sidenav">
          <SideBar />
        </div>
        <div className="layout_section_content">{children}</div>
      </div>
    </div>
  );
};

export default CustomLayout;
