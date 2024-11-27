import React, { useState, useEffect } from 'react';
import './AdminPage.scss';
import CustomLayout from '../../components/CustomLayout/CustomLayout';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '../../components/Table/Table';
import TablePagination from "@mui/material/TablePagination";
import axios from 'axios';
import { message } from 'antd';

const AdminPage = () => {

    // State hooks to manage form values
    const [leadType, setLeadType] = useState('Select an option');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);  // Assuming you are using the row selection in your Table
    const [telecaller, setTelecaller] = useState('');
    const [numberOfLeads, setNumberOfLeads] = useState(0);
    const [leadData, setLeadData] = useState([]); // To store the leads data fetched from API
    const token = localStorage.getItem('authToken');

    const columns = [
        { title: "Name", dataIndex : "name" },
        { title: "Email", dataIndex: "email" },
        { title: "Phone", dataIndex: "phone_number" },
        { title: "Assigned_to", dataIndex: "assigned_telecaller" },
        { title: "Lead Status", dataIndex: "status" },
            {
              title: "Follow up date",
              dataIndex: "updated_at",
              render: (updated_at) => {
                if (!updated_at) return ""; // Handle null or undefined values
                const date = new Date(updated_at); // Convert to Date object
          
                // Format the date
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
                const day = date.getDate().toString().padStart(2, "0");
          
                // Format the time
                const hours = date.getHours(); // Use `getUTCHours()` for UTC
                const minutes = date.getMinutes().toString().padStart(2, "0");
          
                // Combine date and time
                return `${year}-${month}-${day} ${hours}:${minutes}`;
              },
            },
        ];
          
          
  

    const TypeOfLeads = [
        { value: 'Select an option', label: 'Select an option' },
        { value: 'EL', label: 'Enquiry Leads' },
        { value: 'WL', label: 'WorkShop Leads' },
    ];

    // Fetch leads data from API based on leadType
    const fetchLeads = () => {
        if (leadType === 'Select an option') {
            message.error('Please select a type of lead');
            return;
        }

        // Construct the correct API URL based on the lead type
        const apiUrl = leadType === 'WL' 
            ? 'http://127.0.0.1:8000/api/workshopleadsAdminpage/1/' // API for Workshop Leads
            : 'http://127.0.0.1:8000/api/leads/'; // Default API for other lead types

        axios
            .get(apiUrl, {
                params: { leadType }, // Send leadType as query param
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            
            .then((response) => {
                console.log(response)
                setLeadData(response.data); // Update the state with the fetched leads data
            })
            .catch((error) => {
                message.error("Failed to fetch leads");
                console.error("Error fetching leads:", error);
            });
    };

    useEffect(() => {
        // Fetch leads when leadType changes
        if (leadType !== 'Select an option') {
            fetchLeads();
        }
    }, [leadType]);  // Effect runs when leadType changes

    return (
        <CustomLayout>
            <div className="adminPage">
                <div className="adminPage_up">
                    <TextField
                        style={{ width: "20%", padding: "" }}
                        id="Types of Lead"
                        select
                        label="Select types of Lead"
                        value={leadType}
                        onChange={(e) => setLeadType(e.target.value)}
                    >
                        {TypeOfLeads.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div className="adminPage_table">
                    <Table
                        columns={columns}
                        data={leadData}  // Pass the fetched lead data to the table
                        selectedRowKeys={selectedRowKeys}  // Assuming you're using a selection feature on Table
                        onRowSelectionChange={(keys) => setSelectedRowKeys(keys)}
                    />
                </div>

                <div className="adminPage_pagination">
                    <TablePagination
                        component="div"
                        // Additional pagination code can be added here
                    />
                </div>
            </div>
        </CustomLayout>
    );
};

export default AdminPage;
