import React, { useState, useEffect } from "react";
import "./StudentTable.scss";
import Navbar from "../../components/navbar/NavBar"; 
import SideBar from "../../components/SideBar/SideBar"; 
import StudentForm from "../StudentForm/StudentForm";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/students/?search=${searchQuery}`
      );
      const data = await response.json();
      if (Array.isArray(data.results)) {
        setStudents(data.results);
      } else {
        console.error("Expected an array of students, but got:", data.results);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (student) => {
    setEditingStudent(student);
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

  return (
    <div className="student-table-page">
      <Navbar />
      <div className="main-content">
        <SideBar />
        <div className="table-container">
          <div className="student-table">
            <input
              type="search"
              placeholder="Search Students"
              value={searchQuery}
              onChange={handleSearchChange}
            />
             <button onClick={() => setIsVisible(true)}>+ Add student</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Lead ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>User ID</th>
                <th>DOB</th>
                <th>Address</th>
                <th>Enroll Status</th>
                <th>Created At</th>
                <th>Updated At</th>
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
                    <td>{student.user_id}</td>
                    <td>{student.date_of_birth}</td>
                    <td>{student.address}</td>
                    <td>{student.enrollment_status}</td>
                    <td>{student.created_at}</td>
                    <td>{student.updated_at}</td>
                    <td>
                      <button onClick={() => handleEdit(student)}>
                        <i className="ri-edit-fill"></i>
                      </button>
                      <button onClick={() => handleDelete(student.id)}>
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
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isVisible && (
        <StudentForm
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          customer={editingStudent}
        />
      )}
    </div>
  );
};

export default StudentTable;
