import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/NavBar";
import LeadForm from "../../components/LeadForm/LeadForm";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]); // Initialize customers as an empty array
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);


  // Get current customers
  const indexOfLastCustomer = currentPage * customersPerPage;
  let indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  // console.log(currentCustomers);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsVisible(true);
  };
console.log("editingCustomer", editingCustomer)
  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/customers/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              // Add any authentication headers if required
            },
          }
        );
        
        

        if (response.ok) {
          // Remove the deleted customer from the state
          setCustomers(
            customers.filter((customer) => customer.id !== customerId)
          );
        } else {
          console.error("Failed to delete customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  
  // Fetch customer data from the backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/customers/")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.results)) {
          setCustomers(data.results); // Set customers to data.results, which is an array
        } else {
          console.error(
            "Expected an array of customers, but got:",
            data.results
          );
        }
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

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
              <input type="search" placeholder="search" />
              <i className="ri-search-line"></i>
             
            </div>
          </div>
          <div className="dashboard_right_table">
            <table border="0" style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th id="srNo">srNo.</th>
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
                        <button onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)}>
                          Delete
                        </button>
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
                <button onClick={() => paginate(currentPage - 1)}>Previous</button>
                <span style={{ border: "1px solid black", padding: "5px" }}>
                  {currentPage}
                </span>
                <button onClick={() => paginate(currentPage + 1)}>Next</button>
              </div>
            </table>
          </div>
        </div>
      </div>
      {isVisible && (
        <LeadForm isVisible={isVisible} setIsVisible={setIsVisible} customer={editingCustomer}/>
      )}
    </div>
  );
};

export default Dashboard;
