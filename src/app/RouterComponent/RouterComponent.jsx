import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn";
import Dashboard from "../Pages/Dashboard/Dashboard";
import LeadForm from "../components/LeadForm/LeadForm";
import ProductForm from "../components/Product_form/Product_form";

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
        <Route path="/Product_form" element={<ProductForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
