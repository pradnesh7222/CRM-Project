import React, { useState } from 'react';
import './EnrolleTable.scss';
import Navbar from '../navbar/NavBar';
import SideBar from '../SideBar/SideBar';

const EnrolleTable = ({ enrolledStudent = [], handleEdit, handleDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(Math.ceil(enrolledStudent.length / itemsPerPage));

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
                <th id="studentName">Student Name</th>
                <th id="course">Course</th>
                <th id="enrollDate">Enrollment Date</th>
                <th id="status">Status</th>
                <th id="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.studentName}</td>
                    <td>{item.course}</td>
                    <td>{item.enrollDate}</td>
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
                            console.error("Lead ID is undefined:", item);
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
                  <td colSpan="6">No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            <span> {currentPage}</span>
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
