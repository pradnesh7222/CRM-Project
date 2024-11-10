import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";

const Dashboard = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [ordersPerPage] = useState(5); // Orders per page
  const [totalCount, setTotalCount] = useState(0); // Total number of orders from the API
  const [searchQuery, setSearchQuery] = useState(""); // For search query
  const token = localStorage.getItem('authToken');
  // Paginate logic for orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  // Ensure `orders` is an array before calling slice()
  const currentOrders = Array.isArray(orders) ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];

  const totalPages = Math.ceil(totalCount / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch order details from the API
  useEffect(() => {
    fetchOrders();  // Fetch orders initially
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      const payload = {
        "pageIndex": currentPage - 1,  // 0-based index
        "pageSize": ordersPerPage,
        "searchString": searchQuery,  // Use searchQuery in the payload
        "fromDate": null,
        "toDate": null,
      };

      const response = await fetch('https://development1.promena.in/api/Admin/GetAllEnquiryForms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hlbnRyeUB5b3BtYWlsLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IlRlY2hFbnRyeUFkbWluIiwicm9sZSI6IjIiLCJuYmYiOjE3MzA3ODYzNzcsImV4cCI6MTczNDM4NjM3NywiaWF0IjoxNzMwNzg2Mzc3LCJpc3MiOiJUZWNoRW50cnkuY29tIiwiYXVkIjoiVGVjaEVudHJ5LmNvbSJ9.7tuhMMh_5Nzc1woXHPPrG3lbT-PmWkQ98at5_ccqg6M',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data) {
        setOrders(Array.isArray(data.data) ? data.data : []);  // Set the fetched orders
        setTotalCount(data.totalCount || 0);  // Set total count of orders for pagination
        saveOrdersToLeads(data.data); // Automatically save orders once fetched
      } else {
        console.error("Failed to fetch", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle Search Query Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Function to send the orders to the leads API
  const sendOrderToLeads = async (order) => {
    try {
      const courseName = order.course;  // assuming order.course is the name of the course
      console.log(courseName);
  
      // Fetch course ID by name from the backend
      const courseResponse = await fetch("http://127.0.0.1:8000/create-lead/", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: courseName,  // Send course name in request body
        }),
      });
  
      const courseData = await courseResponse.json();
      console.log("Course ID:", courseData);
      if (courseData) {
        const courseId = courseData.courseId;
        console.log("Course ID:", courseId);  
  
        // Now send the order with the course ID
        const leadResponse = await fetch("http://127.0.0.1:8000/leads/", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: order.name,
            email: order.email,
            phone_number: order.phoneNumber,
            course: courseId,  
          }),
        });
  
        const data = await leadResponse.json();
  
        if (leadResponse.ok) {
          console.log("Order sent to leads API:", data);
        } else {
          console.error("Error saving order to leads:", data);
        }
      } else {
        console.error("Course not found");
      }
    } catch (error) {
      console.error("Error sending order to leads:", error);
    }
  };
  
  

  // Function to save all orders to the leads API automatically
  const saveOrdersToLeads = async (orders) => {
    if (Array.isArray(orders)) {
      try {
        for (let order of orders) {
          await sendOrderToLeads(order);
        }
        console.log("All orders saved to leads API successfully!");
      } catch (error) {
        console.error("Error saving orders:", error);
      }
    }
  };
  
  // Handle search query change

  return (
    <div style={{ width: "100%" }}>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard_left">
          <SideBar />
        </div>
        <div className="dashboard_right">
          <div className="dashboard_right_upper">
            <div className="search-btn">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <i className="ri-search-line"></i>
            </div>
          </div>

          {/* Orders Table */}
          <div className="dashboard_right_table">
            <table border="0" style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Srno.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <tr key={order.enquiryFormId}>
                      <td>{index + 1 + indexOfFirstOrder}</td>
                      <td>{order.name}</td>
                      <td>{order.email}</td>
                      <td>{order.phoneNumber}</td>
                      <td>{order.course}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="dashboard_right_table_footer">
            <span>Total Pages: {totalPages}</span>
            <div className="dashboard_right_table_footer_block">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span style={{ padding: "5px" }}>{currentPage}</span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
