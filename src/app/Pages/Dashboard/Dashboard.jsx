import React, { useState,useEffect } from 'react'
import './Dashboard.scss'
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/NavBar'
import Layout_main from '../../components/layout/layout';
import LeadForm from '../../components/LeadForm/LeadForm';
import searchIcon from '../../Assets/search-line.svg'

const Dashboard = () => {

  const [isVisible ,setIsVisible] = useState(false);

  
  

    const tableData = [
      { srNo: '', FirstName: '', LastName: '', email: '' , Phone:'' , Company:'', Status:'' },
      
    ];    

   
  

  return (
    <div style={{width:"100%"}}>
    <Navbar/> 
    <div className="dashboard">
        <div className="dashboard_left">
          <div className="link1"> <Link to="/about">Home</Link></div>
          <div className="link1"> <Link to="/about">Product</Link></div>
          <div className="link1"> <Link to="/about">Manage Services</Link></div>
          <div className="link1"> <Link to="/about">Orders</Link></div>
          {/* <div className="link1"> <Link to="/about">Opportunity</Link></div> */}
      
        </div>
        <div className="dashboard_right">
        <div className="dashboard_right_upper">
          <button onClick={() => {
            setIsVisible(true)
            // console.log("im ain")
            }}>+ Create Lead</button>
          <div className="search-btn ">
          <input type="search"  placeholder='search'   />
          <i class="ri-search-line"></i>
          </div>
        </div>
         <div className="dashboard_right_table">
         <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>srNo.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
            <div className="dashboard_right_table_list">
              <h5>1</h5>
              <h5>Rishikesh</h5>
              <h5>Narayan</h5>
              <h5>rishikesh@gmail.com</h5>
              <h5>7091976512</h5>
              <h5>Promena</h5>
              <h5>connected</h5>

            </div>
         </div>
         </div>
    </div>
    {
              isVisible &&
              <LeadForm isVisible={isVisible} setIsVisible={setIsVisible}/>
            }
    </div>
    
  )
}

export default Dashboard


