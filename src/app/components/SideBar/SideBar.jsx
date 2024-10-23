import React from "react";
import "./SideBar.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar/NavBar";
import ProductForm from "../Product_form/Product_form";

const SideBar = () => {
  const [isProductFormVisible, setIsProductFormVisible] = useState(false);
const handleClick = () => {
console.log("isProductFormVisible",isProductFormVisible)
  setIsProductFormVisible(true)
}

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
          <Link onClick={handleClick}>Courses</Link>
          <ProductForm
              isProductFormVisible={isProductFormVisible}
              setIsProductFormVisible={setIsProductFormVisible}
            />
          </div>
          <div className="link1">
            <Link to="/StudentTable">Students</Link>
          </div>
          <div className="link1">
            <Link to="">Orders</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
