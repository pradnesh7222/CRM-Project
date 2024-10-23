import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/NavBar";
import LeadForm from "../../components/LeadForm/LeadForm";
// import ProductForm from "../../components/Product_form/Product_form";
import SideBar from "../../components/SideBar/SideBar";

const Dashboard = () => {
  const [leads, setLeads] = useState([]); // Renamed customers to leads
  const [isVisible, setIsVisible] = useState(false);
  // const [isProductFormVisible, setIsProductFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastLead = currentPage * leadsPerPage;
  let indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const [editingLead, setEditingLead] = useState(null); // Renamed editingCustomer to editingLead

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsVisible(true);
  };

  const handleDelete = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
        console.log("Deleting lead with ID:", leadId);
        try {
            const response = await fetch(`http://127.0.0.1:8000/leads/${leadId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const responseData = await response.json(); // Capture response data
            console.log(responseData); // Log the response for debugging
            
            if (response.ok) {
                setLeads(leads.filter((lead) => lead.id !== leadId));
            } else {
                alert(`Failed to delete lead: ${responseData.detail || "Unknown error"}`); // Notify user
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
            alert("An error occurred while deleting the lead. Please try again.");
        }
    }
};

  useEffect(() => {
    fetchLeads(); // Updated function name
  }, [searchQuery]);

  const fetchLeads = async () => { // Updated function name
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/leads/?search=${searchQuery}`
      );
      const data = await response.json();
      if (Array.isArray(data.results)) {
        setLeads(data.results); // Updated for leads
      } else {
        console.error("Expected an array of leads, but got:", data.results); // Updated for leads
      }
    } catch (error) {
      console.error("Error fetching leads:", error); // Updated for leads
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
          <SideBar />
        </div>
        <div className="dashboard_right">
          <div className="dashboard_right_upper">
            <button onClick={() => setIsVisible(true)}>+ Create Lead</button> {/* Updated text */}
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
                  <th id="lead_source_id">Lead Source ID</th>
                  <th id="assigned_to_user_id">Assigned to User ID</th>
                  <th id="lead_score">Lead Score</th>
                  <th id="created_at">Created At</th>
                  <th id="updated_at">Updated At</th>
                  <th id="notes">Notes</th>
                  <th id="status">Status</th>
                  <th id="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  currentLeads.map((item, index) => (
                    <tr key={item.id}> {/* Use item.id for the key */}
                      <td>{++indexOfFirstLead}</td>
                      <td>{item.first_name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.lead_source_id}</td>
                      <td>{item.assigned_to_user_id}</td>
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
                          <button onClick={() => {
                            if (item.id) {
                              handleDelete(item.id);
                            } else {
                              console.error("Lead ID is undefined:", item); // Log error if ID is undefined
                            }
                          }}>
                            <i className="ri-delete-bin-line"></i>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No leads found</td> {/* Updated text */}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

      {isVisible && (
        <LeadForm
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          lead={editingLead} // Updated prop name
        />
      )}
    </div>
  );
};

export default Dashboard;
