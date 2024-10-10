import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn";
import Navbar from "../components/navbar/NavBar";
import Dashboard from "../Pages/Dashboard/Dashboard";

const RouterComponent = () => {
  return (
    <BrowserRouter>
    {/* <Navbar/> */}
      <Routes>
        {/* <Route path="/" element={<SignUp />} /> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
        
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
