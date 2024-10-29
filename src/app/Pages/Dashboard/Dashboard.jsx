import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/NavBar";
import LeadForm from "../../components/LeadForm/LeadForm";
import SideBar from "../../components/SideBar/SideBar";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderField, setOrderField] = useState("first_name");
  const [orderDirection, setOrderDirection] = useState("asc");

  const indexOfLastLead = currentPage * leadsPerPage;
  let indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [editingLead, setEditingLead] = useState(null);

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsVisible(true);
  };

  const handleDelete = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/leads/${leadId}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setLeads(leads.filter((lead) => lead.id !== leadId));
        } else {
          const responseData = await response.json();
          alert(`Failed to delete lead: ${responseData.detail || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error deleting lead:", error);
        alert("An error occurred while deleting the lead. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchQuery, orderField, orderDirection]);
  const fetchLeads = async () => {
    try {
      const url = `http://127.0.0.1:8000/leads/?search=${encodeURIComponent(searchQuery)}&ordering=${orderDirection === "asc" ? orderField : `-${orderField}`}`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      setLeads(data.results || data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setOrderField(field);
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
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
                  <th>Sr No.</th>
                  <th onClick={() => handleSort("first_name")}>First Name</th>
                  <th >Last Name</th>
                  <th onClick={() => handleSort("email")}>Email</th>
                  <th onClick={() => handleSort("phone_number")}>Phone</th>
                  <th>Assigned to User ID</th>
                  <th >Lead Score</th>
                  <th onClick={() => handleSort("created_at")}>Created At</th>
                  <th>Updated At</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  currentLeads.map((item, index) => (
                    <tr key={item.id}>
                      <td>{++indexOfFirstLead}</td>
                      <td>{item.first_name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.assigned_to_user}</td>
                      <td>{item.lead_score}</td>
                      <td>{item.created_at}</td>
                      <td>{item.updated_at}</td>
                      <td>{item.notes}</td>
                      <td>{item.status}</td>
                      <td>
                        <div className="actions">
                          <button onClick={() => handleEdit(item)}>
                            <i className="ri-edit-fill"></i>
                          </button>
                          <button onClick={() => handleDelete(item.id)}>
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="dashboard_right_table_footer">
            <span>Total Pages: {totalPages}</span>
            <div className="dashboard_right_table_footer_block">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              <span style={{ padding: "5px" }}>{currentPage}</span>
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {isVisible && (
        <LeadForm
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          lead={editingLead}
        />
      )}
    </div>
  );
};

export default Dashboard;
