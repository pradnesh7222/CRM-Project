import React, { useState, useEffect } from "react";
import "./WorkshopLeads.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import TablePagination from '@mui/material/TablePagination';


const WorkshopLeads = () => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10); 
  const [totalCount, setTotalCount] = useState(0); 
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = enrolledStudents.slice(indexOfFirstLead, indexOfLastLead);

  const totalPages = Math.ceil(totalCount / leadsPerPage);
  console.log(currentLeads, 'totalPages:', totalPages, 'leadsPerPage:', leadsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch data and store in state
  useEffect(() => {
    fetchWorkshopLeads();
  }, [currentPage, searchQuery]);
  

  const fetchWorkshopLeads = async () => {
    try {
      const payload = {
        pageIndex: currentPage -1,
        pageSize: leadsPerPage,
        searchString: searchQuery,
        fromDate: null,
        toDate: null,
      };

      const response = await fetch("https://development1.promena.in/api/Admin/GetAllOrderDetails?companyTypeId=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlY2hlbnRyeUB5b3BtYWlsLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IlRlY2hFbnRyeUFkbWluIiwicm9sZSI6IjIiLCJuYmYiOjE3MzA3ODYzNzcsImV4cCI6MTczNDM4NjM3NywiaWF0IjoxNzMwNzg2Mzc3LCJpc3MiOiJUZWNoRW50cnkuY29tIiwiYXVkIjoiVGVjaEVudHJ5LmNvbSJ9.7tuhMMh_5Nzc1woXHPPrG3lbT-PmWkQ98at5_ccqg6M",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (data) {
        setEnrolledStudents(Array.isArray(data.data) ? data.data : []);
        setTotalCount(data.totalCount || 0);
        saveWorkshopLeads(data.data);
        console.log(data.totalCount, 'data.totalCount');
      } else {
        console.error("Failed to fetch data:", data?.message || "No data returned");
      }
    } catch (error) {
      console.error("Error fetching workshop leads:", error);
    }
  };

  const saveWorkshopLeads = async (leadsData) => {
    console.log(`Fetching data for page ${currentPage} with page size ${leadsPerPage}`);
    if (!Array.isArray(leadsData)) {
      console.error("Error: leadsData is not an array.");
      return;
    }

    try {
      // Send the data one by one
      for (const lead of leadsData) {
        const formattedData = {
          orderDate: lead.orderDate,
          orderId: lead.orderId,
          customerName: lead.customerName,
          customerNumber: lead.customerNumber,
          customerEmail: lead.customerEmail,
          amount: lead.amount,
          paymentStatus: lead.paymentStatus,
          location: lead.location,
        };

        console.log(formattedData, "formattedData");

        // Send each lead individually
        const response = await fetch("http://127.0.0.1:8000/WorkshopLeads/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error(`Failed to save lead with orderId: ${lead.orderId}`);
        }
        console.log(`Lead with orderId: ${lead.orderId} saved successfully.`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  return (
    <div style={{ width: "100%" }}>
      <Navbar />
      <div className="workshopLead">
        <div className="workshopLead_left">
          <SideBar />
        </div>
        <div className="workshopLead_right">
          <div className="workshopLead_right_upper">
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

          {/* Workshop Leads Table */}
          <div className="workshopLead_right_table">
            {/* <h3>Workshop Leads</h3> */}
            <table border="0" style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Order Id</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.length > 0 ? (
                  currentLeads.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1 + indexOfFirstLead}</td>
                      <td>... {item.orderId.slice(-3)}</td>
                      <td>{item.customerName}</td>
                      <td>{item.customerNumber}</td>
                      <td>{item.customerEmail}</td>
                      <td>{item.location}</td>
                      <td>{item.amount}</td>
                      <td>{item.paymentStatus}</td>
                      <td>{item.orderDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopLeads;
