import React, { useEffect, useState } from 'react'; 
import './EnrolleTable.scss';
import Navbar from '../navbar/NavBar';
import SideBar from '../SideBar/SideBar';
import TablePagination from '@mui/material/TablePagination';

const EnrolleTable = ({ handleEdit, handleDelete }) => {
  const [enrolledStudent, setEnrolledStudent] = useState([]); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0); 

  const fetchEnrolledStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/StudentsEnrollmentHistory/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEnrolledStudent(data.results);
      setTotalCount(data.count); 
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []); 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedStudents = enrolledStudent.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                <th id="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1 + page * rowsPerPage}</td>
                    <td>{item.student?.first_name}</td>
                    <td>{item.course?.name}</td> 
                    <td>{item.enrollment_date}</td>
                    <td>{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No enrolled students found</td>
                </tr>
              )}
            </tbody>
          </table>
          
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
    </>
  );
};

export default EnrolleTable;
