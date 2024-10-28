import React, { useEffect, useState } from 'react'; 
import './EnrolleTable.scss';
import Navbar from '../navbar/NavBar';
import SideBar from '../SideBar/SideBar';

const EnrolleTable = ({ handleEdit, handleDelete }) => {
  const [enrolledStudent, setEnrolledStudent] = useState([]); // State to store enrolled students
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0); // Initialize totalPages

  const fetchEnrolledStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/enrollments/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched enrolled students:", data);
      setEnrolledStudent(data.results); // Assuming the API response has a 'results' property
      
      // Set total pages using the total number of students from the API (if available)
      setTotalPages(Math.ceil(data.count / itemsPerPage)); // Assuming data.count is total number of enrolled students
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };

  useEffect(() => {
    fetchEnrolledStudents(); // Fetch students on component mount
  }, []); // Empty dependency array to run only once

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedStudents = enrolledStudent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div style={{ width: "100%" }}>
        <Navbar />
      </div>
      <div className="enroll">
        <div className="enrollSide">
          <SideBar />
        </div>
        <div className="enrollTable">
          <table border="0" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th id="srNo">Sr No.</th>
                <th id="student">Student Name</th>
                <th id="course">Course</th>
                <th id="enrollment_date">Enrollment Date</th>
                <th id="status">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{item.student.first_name}</td>  {/* Access student name */}
                    <td>{item.course.name}</td> 
                    <td>{item.enrollment_date}</td>
                    <td>{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button key={index} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                {index + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrolleTable;
