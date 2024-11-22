import React, { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import "./Dashboard.scss";
import CustomLayout from "../../components/CustomLayout/CustomLayout";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("authToken");
  const [leadSource, setLeadSource] = useState("");
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

  const fetchOrders = async () => {
    try {
      const payload = {
        pageIndex: currentPage,
        pageSize: ordersPerPage,
        searchString: searchQuery,
        fromDate: null,
        toDate: null,
      };

      const response = await fetch(
        "https://development1.promena.in/api/Admin/GetAllEnquiryForms/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hlbnRyeUB5b3BtYWlsLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IlRlY2hFbnRyeUFkbWluIiwicm9sZSI6IjIiLCJuYmYiOjE3MzA3ODYzNzcsImV4cCI6MTczNDM4NjM3NywiaWF0IjoxNzMwNzg2Mzc3LCJpc3MiOiJUZWNoRW50cnkuY29tIiwiYXVkIjoiVGVjaEVudHJ5LmNvbSJ9.7tuhMMh_5Nzc1woXHPPrG3lbT-PmWkQ98at5_ccqg6M',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data) {
        setOrders(Array.isArray(data.data) ? data.data : []);
        setTotalCount(data.totalCount || 0);
        saveOrdersToLeads(data.data);
      } else {
        console.error("Failed to fetch", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const sendOrderToLeads = async (order) => {
    try {
      const courseName = order.course;

      const courseResponse = await fetch("http://127.0.0.1:8000/create-lead/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: courseName,
        }),
      });

      const courseData = await courseResponse.json();
      if (courseData) {
        const courseId = courseData.courseId;
        const leadResponse = await fetch("http://127.0.0.1:8000/leads/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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
        console.log(data)
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to the first page when a new search is triggered
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setOrdersPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };
  const handleLeadSource = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/leads/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();
        const lead_source=data[0].lead_source;
        setLeadSource(lead_source);
        console.log(lead_source); // You can handle the data here as needed
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/download-excel/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "enquiry_leads.xlsx"; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("Excel file downloaded successfully!");
      } else {
        console.error("Failed to download Excel file.");
      }
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };
  useEffect(()=>{
    handleLeadSource()
  })

  useEffect(() => {
    fetchOrders();
  }, [currentPage, ordersPerPage, searchQuery]); // Add searchQuery as a dependency

  return (
    <CustomLayout>
      <div className="dashboard">
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
            <button onClick={handleDownloadExcel}>Download Excel</button>
          </div>

          <div className="dashboard_right_table">
            <table border="0" style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Srno.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Course</th>
                  <th>Lead Source</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order.enquiryFormId}>
                      <td>{index + 1 + currentPage * ordersPerPage}</td>
                      <td>{order.name}</td>
                      <td>{order.email}</td>
                      <td>{order.phoneNumber}</td>
                      <td>{order.course}</td>
                      <td>{leadSource}</td>
                     
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> 

          <div className="dashboard_right_table_footer">
            <TablePagination
              component="div"
              count={totalCount}
              page={currentPage}
              onPageChange={handlePageChange}
              rowsPerPage={ordersPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default Dashboard;
