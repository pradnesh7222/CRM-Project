import React, { useState, useEffect } from "react";
import "./StudentTable.scss";
import Navbar from "../../components/navbar/NavBar"; 
import SideBar from "../../components/SideBar/SideBar"; 
import StudentForm from "../StudentForm/StudentForm";   
import { useNavigate, useLocation } from "react-router-dom";

const StudentTable = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const filter = location.state?.filter || {};
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const [orderField, setOrderField] = useState("first_name");
  const [orderDirection, setOrderDirection] = useState("asc");
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    fetchStudents();
  }, [filter, searchQuery, orderField, orderDirection]);

  const fetchStudents = async () => {
    try {
      const url = `http://127.0.0.1:8000/students/?search=${encodeURIComponent(searchQuery)}&ordering=${orderDirection === "asc" ? orderField : `-${orderField}`}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
          "Content-Type": "application/json", // Optional: Specify the content type
        },
      });
      const data = await response.json();

  
      
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsVisible(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/students/${studentId}/`,
          { method: "DELETE", headers: { "Content-Type": "application/json" ,
            Authorization: `Bearer ${token}`,
          } }
        );
        if (response.ok) {
          setStudents(students.filter((student) => student.id !== studentId));
        } else {
          console.error("Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
      }
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
    <>
      <Navbar />
      <div className="mainCont">
        <div className="sidebarCont">
          <SideBar />
        </div>
        
        <div className="table-container">
          <div className="student-table-header">
            <button className="add-btn" onClick={() => navigate("/StudentForm")}>+ Add Student</button>
            <div className="search-input">
              <input
                type="search"
                placeholder="Search Students"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <i className="ri-search-line"></i>
            </div>
          </div>
          <div className="student-table">
            <table>
              <thead>
                <tr>
                  <th>Sr.</th>
                  
                  <th onClick={() => handleSort("first_name")}>First Name</th>
                
                  <th onClick={() => handleSort("email")}>Email</th>
                  <th onClick={() => handleSort("phone_number")}>Phone</th>
                  <th>DOB</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Total Fees Paid</th>
                  <th>Next due date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  currentStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + indexOfFirstStudent + 1}</td>
                      <td>{student.first_name}</td>
                     
                      <td>{student.email}</td>
                      <td>{student.phone_number}</td>
                      <td>{student.date_of_birth}</td>
                      <td>{student.address}</td>
                      <td>{student.enrollment_status}</td>
                      <td>{student.total_fees_paid}</td>
                      <td>{student.next_due_date || "null"}</td>

                      <td>
                        <button onClick={() => handleEdit(student)} className="edit-btn">
                          <i className="ri-edit-fill"></i>
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="delete-btn">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13">No Students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || students.length === 0}
              className="pagination-btn"
            >
              Next
            </button>
          </div>

          {isVisible && (
            <StudentForm
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              student={editingStudent}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default StudentTable;
