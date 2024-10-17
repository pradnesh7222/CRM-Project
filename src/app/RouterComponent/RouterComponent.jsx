import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn";
import Dashboard from "../Pages/Dashboard/Dashboard";
import LeadForm from "../components/LeadForm/LeadForm";

const RouterComponent = () => {
  return (
    <BrowserRouter>
    {/* <Navbar/> */}
      <Routes>
        {/* <Route path="/" element={<SignUp />} /> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/LeadForm" element={<LeadForm />} />
        <Route path="/Signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
