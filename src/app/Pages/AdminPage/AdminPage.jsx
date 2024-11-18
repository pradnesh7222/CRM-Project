import React from 'react'
import './AdminPage.scss'
import CustomLayout from '../../components/CustomLayout/CustomLayout'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '../../components/Table/Table';
import TablePagination from "@mui/material/TablePagination";


const AdminPage = () => {

    const columns=[

        { title: "Name", dataIndex : "name" },
        { title: "Email", dataIndex: "email" },
        { title: "Phone", dataIndex: "phone" },
        { title: "Assigned_to", dataIndex: "assigned_to" },
        { title: "Lead Status", dataIndex: "Lead_status" },
        { title: "Follow up date", dataIndex: "FollowUp_date" },
    ]

    const TypeOfLeads = [
        {
          value: 'Select an option',
          label: 'Select an option',
        },
        {
          value: 'EL',
          label: 'Enquiry Leads',
        },
        {
          value: 'WL',
          label: 'WorkShop Leads',
        },
      ];

      const handleSubmit = (e) => {
        e.preventDefault();
    
        // const selectedLeads = selectedRowKeys.map((key) => data[key]);
    
        // const payload = {
        //   telecaller,
        //   numberOfLeads,
        //   leads: selectedLeads,
        // };
    
        // axios
        //   .post("http://127.0.0.1:8000/get_workshopleads_by_telecaller/", payload, {
        //     headers: {
        //       accept: "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   })
        //   .then(() => {
        //     message.success("Leads assigned successfully");
        //     setSelectedRowKeys([]);
        //     setNumberOfLeads(0);
        //   })
        //   .catch((error) => {
        //     message.error("Failed to assign leads");
        //     console.error("Error assigning leads:", error);
        //   });
      };

  return (
   <CustomLayout>
    <div className="adminPage">
        <div className="adminPage_up">
        <TextField 
          style={{width:"20%", padding:""}}
          id="Types of Lead"
          select
          label="Select types of Lead"
          defaultValue="Select types of Lead"
        //   helperText="Select type of Lead"
        >
          {TypeOfLeads.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
            </TextField>
        </div>
        <div className="adminPage_table">
         <Table columns={columns} />
        </div>

        <div className="adminPage_pagination">
        <div className="submit-button" onClick={handleSubmit}>
            <button type="submit">Assign Leads</button>
          </div>
          <TablePagination
            component="div"
            // count={totalCount}
            // page={page}
            // onPageChange={handleChangePage}
            // rowsPerPage={rowsPerPage}
            // onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>

    </div>
   </CustomLayout>
  )
}

export default AdminPage