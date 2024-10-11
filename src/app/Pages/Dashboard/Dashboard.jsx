import React, { useState, useEffect } from 'react';
import './Dashboard.scss';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/NavBar';
import LeadForm from '../../components/LeadForm/LeadForm';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]); // Initialize customers as an empty array
  const [isVisible, setIsVisible] = useState(false);

  // Fetch customer data from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/customers/')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.results)) {
          setCustomers(data.results); // Set customers to data.results, which is an array
        } else {
          console.error('Expected an array of customers, but got:', data.results);
        }
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);
  
  return (
    <div style={{ width: '100%' }}>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard_left">
          <div className="link1">
            <Link to="/about">Home</Link>
          </div>
          <div className="link1">
            <Link to="/about">Product</Link>
          </div>
          <div className="link1">
            <Link to="/about">Manage Services</Link>
          </div>
          <div className="link1">
            <Link to="/about">Orders</Link>
          </div>
        </div>
        <div className="dashboard_right">
          <div className="dashboard_right_upper">
            <button onClick={() => setIsVisible(true)}>+ Create Lead</button>
            <div className="search-btn">
              <input type="search" placeholder="search" />
              <i className="ri-search-line"></i>
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
                {customers.length > 0 ? (
                  customers.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.first_name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isVisible && <LeadForm isVisible={isVisible} setIsVisible={setIsVisible} />}
    </div>
  );
};

export default Dashboard;
