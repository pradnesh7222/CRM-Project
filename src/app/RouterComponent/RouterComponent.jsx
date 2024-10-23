import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn";
import Dashboard from "../Pages/Dashboard/Dashboard";
import LeadForm from "../components/LeadForm/LeadForm";
import Home from "../components/Home/Home";
import SideBar from "../components/SideBar/SideBar";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import HomeCard from "../components/HomeCard/HomeCard";
import StudentTable from "../components/StudentTable/StudentTable";
import StudentForm from "../components/StudentForm/StudentForm";
import Courses from "../Pages/Courses/Courses";
import TrainProCard from "../components/TrainProCard/TrainProCard";

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/LeadForm" element={<LeadForm />} />
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/SideBar" element={<SideBar />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/HomeCard" element={<HomeCard />} />
        <Route path="/StudentTable" element={<StudentTable />} />
        <Route path="/StudentForm" element={<StudentForm />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/TrainProCard" element={<TrainProCard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
