import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn";
import SignUp from '../Pages/SignUp/SignUp'
import Navbar from "../components/navbar/NavBar";

const RouterComponent = () => {
  return (
    <BrowserRouter>
    {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
