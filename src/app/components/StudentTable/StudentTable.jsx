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
  const [studentType, setStudentType] = useState("active"); // New state to track student type
  const location = useLocation()
  const filter = location.state?.filter || {};
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

 // Added studentType to dependencies
  useEffect(() => {
    fetchStudents();
  }, [filter, searchQuery]);
  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/students/?search=${searchQuery}`);
      const data = await response.json();
      const filteredStudents = data.results.filter(student => {
        return Object.keys(filter).every(key => student[key] === filter[key]);
      });
      setStudents(filteredStudents);
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
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
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

  const handleStudentTypeChange = (e) => {
    setStudentType(e.target.value);
    setCurrentPage(1); // Reset to first page on student type change
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
            <div className="student-type-selection">
              <label>
                <input
                  type="radio"
                  value="active"
                  checked={studentType === "active"}
                  onChange={handleStudentTypeChange}
                />
                Active Students
              </label>
              <label>
                <input
                  type="radio"
                  value="graduated"
                  checked={studentType === "graduated"}
                  onChange={handleStudentTypeChange}
                />
                Graduated Students
              </label>
            </div>
          </div>
          <div className="student-table">
            <table>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Lead ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>User ID</th>
                  <th>DOB</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  currentStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + indexOfFirstStudent + 1}</td>
                      <td>{student.lead_id}</td>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone_number}</td>
                      <td>{student.user}</td>
                      <td>{student.date_of_birth}</td>
                      <td>{student.address}</td>
                      <td>{student.enrollment_status}</td>
                      <td>{student.created_at}</td>
                      <td>{student.updated_at}</td>
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
