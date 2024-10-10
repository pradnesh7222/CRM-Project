import React, { useState } from 'react'
import './Dashboard.scss'
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/NavBar'
import Layout_main from '../../components/layout/layout';
import LeadForm from '../../components/LeadForm/LeadForm';
import searchIcon from '../../Assets/search-line.svg'

const Dashboard = () => {

  const [isVisible ,setIsVisible] = useState(false);

  return (
    <>
    <Navbar/> 
    <div className="dashboard">
        <div className="dashboard_left">
          <div className="link1"> <Link to="/about">Home</Link></div>
          <div className="link1"> <Link to="/about">Leads</Link></div>
          <div className="link1"> <Link to="/about">Customer</Link></div>
          <div className="link1"> <Link to="/about">Product</Link></div>
          <div className="link1"> <Link to="/about">Opportunity</Link></div>
      
        </div>
        <div className="dashboard_right">
        <div className="dashboard_right_upper">
          <button onClick={() => setIsVisible(!isVisible)}>+ Create Lead</button>
          <div className="search-btn ">
          <input type="search"  placeholder='search'   />
          <i class="ri-search-line"></i>
          </div>
        </div>
         <div className="dashboard_right_table">
              <LeadForm isVisible={isVisible} setIsVisible={setIsVisible}/>
         </div>
         </div>
    </div>
    </>
  )
}

export default Dashboard


