import React,{useState} from 'react'
import "./WorkshopLeads.scss"
import Navbar from  '../../components/navbar/NavBar'
import SideBar from '../SideBar/SideBar'
import TablePagination from '@mui/material/TablePagination';

const WorkshopLeads = () => {

    const [enrolledStudent, setEnrolledStudent] = useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0); 


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };


    //   const paginatedStudents = .slice(
    //     page * rowsPerPage,
    //     page * rowsPerPage + rowsPerPage
    //   );

  return (
  <>
  <div style={{ width: "100%" }}>
  <Navbar/>
  </div>
  <div className="workshopLead">
   <div className="workshopLead_left">
    <SideBar/>
   </div>
  <div className="workshopLead_right">
  <table border="0" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th id="srNo">Sr No.</th>
                <th id="student">Order Id</th>
                <th id="course">Customer Name</th>
                <th id="enrollment_date">Phone </th>
                <th id="status">Email</th>
                <th id="actions">Location</th>
                <th id="actions">Amount</th>
                <th id="actions">Order Status</th>
                <th id="actions">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {page.length > 0 ? (
                page.map((item, index) => (
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
                  <td colSpan="9">No enrolled students found</td>
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
  )
}

export default WorkshopLeads