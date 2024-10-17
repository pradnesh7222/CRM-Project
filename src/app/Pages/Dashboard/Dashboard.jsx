import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/NavBar";
import LeadForm from "../../components/LeadForm/LeadForm";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]); 
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(""); 


  const indexOfLastCustomer = currentPage * customersPerPage;
  let indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(customers.length / customersPerPage);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsVisible(true);
  };

  const handleDelete = async (customerId) => {

    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/customers/${customerId}/`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setCustomers(customers.filter((customer) => customer.id !== customerId));
        } else {
          console.error('Failed to delete customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

 
  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]); 

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/customers/?search=${searchQuery}`);
      const data = await response.json();
      if (Array.isArray(data.results)) {
        setCustomers(data.results); // Set customers to data.results, which is an array
      } else {
        console.error("Expected an array of customers, but got:", data.results);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
    setCurrentPage(1); 
  };

  return (
    <div style={{ width: "100%" }}>
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
              <input 
                type="search" 
                placeholder="search" 
                value={searchQuery}
                onChange={handleSearchChange} 
              />
              <i className="ri-search-line"></i>
            </div>
          </div>
          <div className="dashboard_right_table">
            <table border="0" style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th id="srNo">Sr No.</th>
                  <th id="firstName">First Name</th>
                  <th id="lastName">Last Name</th>
                  <th id="email">Email</th>
                  <th id="phone">Phone</th>
                  <th id="address">Address</th>
                  <th id="status">Status</th>
                  <th id="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  currentCustomers.map((item, index) => (
                    <tr key={index}>
                      <td>{++indexOfFirstCustomer}</td>
                      <td>{item.first_name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                      <td>
                        <button onClick={() => handleEdit(item)}><i class="ri-edit-fill"></i></button>
                        <button onClick={() => handleDelete(item.id)}><i class="ri-delete-bin-line"></i></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No customers found</td>
                  </tr>
                )}
              </tbody>
              <div className="dashboard_right_table_footer">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span style={{ border: "1px solid black", padding: "5px" }}>
                  {currentPage}
                </span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
              </div>
            </table>
          </div>
        </div>
      </div>
      {isVisible && (
        <LeadForm isVisible={isVisible} setIsVisible={setIsVisible} customer={editingCustomer} />
      )}
    </div>
  );
};

export default Dashboard;
