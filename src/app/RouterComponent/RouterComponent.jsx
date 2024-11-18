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
import IndiaMap from "../components/IndiaMap/IndiaMap";
import HomeGraph from "../components/HomeGraph/HomeGraph";
import HomePieChart from "../components/HomePieChart/HomePieChart";
import HomeLineGraph from "../components/HomeLineGraph/HomeLineGraph";
import AddCourse from "../Pages/AddCourse/AddCourse";
import EnrolleTable from "../components/EnrolleTable/EnrolleTable";
import EnrollForm from "../components/EnrollForm/EnrollForm";
import Communication from "../Pages/Communication/Communication";
import Phone from "../components/Phone/Phone";
import Email from "../components/Email/Email";
import Message from "../components/Message/Message";
import WorkshopLeads from "../components/WorkshopLeads/WorkshopLeads";
import EnquiryTele from "../Pages/EnquiryTele/EnquiryTele";
import WorkShopTele from "../Pages/WorkShopTele/WorkShopTele"
import TeleCallerPage from "../Pages/TelerCallerPage/TeleCallerPage";
import CustomLayout  from "../components/CustomLayout/CustomLayout";
import WorkShopTeleCallerPage from "../Pages/WorkShopTeleCallerPage/WorkShopTeleCallerPage";
import Table from "../components/Table/Table";
import AdminPage from "../Pages/AdminPage/AdminPage";


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
        <Route path="/IndiaMap" element={<IndiaMap />} />
        <Route path="/HomeGraph" element={<HomeGraph />} />
        <Route path="/HomePieChart" element={<HomePieChart />} />
        <Route path="/HomeLineGraph" element={<HomeLineGraph />} />
        <Route path="/AddCourse" element={<AddCourse />}/>
        <Route path="/EnrolleTable" element={<EnrolleTable/>}/>
        <Route path="/EnrollForm" element={<EnrollForm/>}/>
        <Route path="/Communication" element={<Communication/>}/>
        <Route path="/Phone" element={<Phone/>}/>
        <Route path="/Message" element={<Message/>}/>
        <Route path="/Email" element={<Email/>}/>
        <Route path="/WorkshopLeads" element={<WorkshopLeads/>}/>
        <Route path="/EnquiryTele" element={<EnquiryTele/>}/>
        <Route path="/WorkShopTele" element={<WorkShopTele/>}/>
        <Route path="/TeleCallerPage" element={<TeleCallerPage/>}/>
        <Route path="/customlayout" element={<CustomLayout/>}/>
        <Route path="WorkShopTeleCallerPage" element={<WorkShopTeleCallerPage/>}/>
        <Route path="Table" element={<Table/>}/>
        <Route path="AdminPage" element={<AdminPage/>}/>

      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
