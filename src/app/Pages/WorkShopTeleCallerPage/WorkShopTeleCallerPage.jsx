import React, { useEffect, useState } from "react";
import "./WorkShopTeleCallerPage.scss";
import { Button, Drawer } from "antd";
import TextField from "@mui/material/TextField";
import Table from "../../components/Table/Table";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
import { message } from "antd";
import 'remixicon/fonts/remixicon.css';
import CustomLayout from "../../components/CustomLayout/CustomLayout";

const WorkShopTeleCallerPage = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const token = localStorage.getItem("authToken");
  const [leadData, setLeadData] = useState([]);
  const [remarkData, setRemarkData] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [telecaller, setTelecaller] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [selectedLeadId, setSelectedLeadId] = useState(null); // Add state for selected lead ID
  const [date_time, setDateTime] = useState(""); // Add state for date_time

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Contacted", label: "Contacted" },
    { value: "Follow Up", label: "Follow Up" },
    { value: "Converted", label: "Converted" },
    { value: "Closed", label: "Closed" },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "lead_name",
      render: (text, record) => (
        <Link to={`/Communication_Workshop/${record.id}/`}
        style={{ textDecoration: "none", color: "#007BFF", cursor: "pointer" }}
        >{text}</Link> // Pass the 'id' of the student/lead in the URL
      ),
    },
    { title: "Amount", dataIndex: "amount" },
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Email", dataIndex: "lead_email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <a
          onClick={() => {
            showDrawer();
            setSelectedLeadId(record.id); // Set selected lead ID
          }}
          style={{
            cursor: "pointer",
            color: "#007BFF",
          }}
        >
          {text}
        </a>
      ),
    },
    { title: "Remark", dataIndex: "remark_text" },
    {
      title: "Sign",
      dataIndex: "status",
      render: (text) => {
        const statusColorMap = {
          "Pending": "#A9A9A9", // Grey
          "Contacted": "#1E90FF", // Blue
          "Follow Up": "#FFA500", // Orange
          "Converted": "#32CD32", // Green
          "Closed": "red", // Red
        };

        return (
          <i
            className="ri-verified-badge-fill"
            style={{
              color: statusColorMap[text],
              fontSize: "1.5em"
            }}
          ></i>
        );
      },
    },
  ];

  // Fetch lead data
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/Get/AssignedWorkshopTelecaller/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLeadData(response.data.data);
        setTotalCount(response.data.data.length); // Update total count
        //console.log(response.data.data[0].id);
        //setSelectedLeadId(response.data.data[0].id);
      })
      .catch((error) => {
        console.error("Error fetching telecaller data:", error);
      });
  }, [token]);

  // Handle form submission to add new remark
  const handleRemarkSubmit = () => {
    console.log(selectedLeadId,"selectedLeadId")
    if (!selectedLeadId) {
      message.warning("Please select a lead first");
      return;
    }
  
    const url = `http://localhost:8000/RemarkWorkshopLeadViewSet/${selectedLeadId}/update_remark_workshop/`; // Adjust API URL if needed
    const method = remarkData ? "PUT" : "POST"; // Use PUT if updating an existing remark, POST if adding a new one
    
    axios({
      method: method,
      url: url,
      data: {
        remark_text: remark,
        status: status,
        workshop_lead: selectedLeadId,
        created_at: date_time, // Use date_time here
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        message.success("Remark submitted successfully!"); // Show success message
  
        // Update leadData with the new or updated remark
        const updatedLeadData = leadData.map((lead) => {
          if (lead.id === selectedLeadId) {
            return {
              ...lead,
              remark_text: remark,
              status: status,
            };
          }
          return lead;
        });
  
        setLeadData(updatedLeadData); // Update the lead data state with the modified lead
        setRemarkData((prevRemarkData) => [
          ...prevRemarkData,
          { workshop_lead: selectedLeadId, remark_text: remark, status: status, created_at: date_time },
        ]); // Update the remark data state
        onClose(); // Close the drawer
      })
      .catch((error) => {
        console.error("Error submitting remark:", error);
        message.error("Failed to submit remark."); // Show error message
      });
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  return (
    <CustomLayout>
      <div className="workshopTelecaller">
        <div className="workshopTelecaller_table">
          <Table columns={columns} data={leadData} />
        </div>

        <div className="workshopTelecaller_pagination">
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        <Drawer title="Add/Edit Remark" onClose={onClose} open={open}>
          <div className="form-body">
            <TextField
              id="outlined-select-status"
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              helperText="Please select status"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="datetime-local"
              label="Date & Time"
              type="datetime-local"
              value={date_time} // Use the date_time value here
              onChange={(e) => setDateTime(e.target.value)} // Update the date_time state
              className="textfield"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              id="remark"
              label="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              multiline
              rows={4}
              className="textfield"
            />

            <Button
              style={{
                backgroundColor: "#E9B600",
                color: "white",
                border: "none",
                marginTop: "1rem",
              }}
              onClick={handleRemarkSubmit}
            >
              Submit Remark
            </Button>
          </div>
        </Drawer>
      </div>
    </CustomLayout>
  );
};

export default WorkShopTeleCallerPage;
