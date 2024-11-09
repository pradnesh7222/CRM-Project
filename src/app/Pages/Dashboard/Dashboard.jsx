import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Array.isArray(orders) ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];
  const totalPages = Math.ceil(totalCount / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch order details from the API, listening to currentPage and searchQuery changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery]);

  const fetchOrders = async () => {
    try {
      const payload = {
        pageIndex: currentPage - 1,
        pageSize: ordersPerPage,
        searchString: searchQuery,
        fromDate: null,
        toDate: null,
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
        setOrders(Array.isArray(data.data) ? data.data : []);
        setTotalCount(data.totalCount || 0);
      } else {
        console.error("Failed to fetch", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

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
