import React, { useEffect, useState } from "react";
import "./TeleCallerPage.scss";
import { Button, Drawer, message } from "antd";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";
import { Link, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import CustomLayout from "../../components/CustomLayout/CustomLayout";
import Table from "../../components/Table/Table";

const TeleCallerPage = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const token = localStorage.getItem("authToken");
  const [leadData, setLeadData] = useState([]);
  const [remarkData, setRemarkData] = useState(null); // State to store the remark data for the selected lead
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [telecaller, setTelecaller] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [date_time, setDateTime] = useState(""); // Updated variable name for date_time
  const navigate = useNavigate();
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Contacted", label: "Contacted" },
    { value: "Follow Up", label: "Follow_Up" },
    { value: "Converted", label: "Converted" },
    { value: "Closed", label: "Closed" },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "lead_name",
      key: "lead_name",
      render: (text, record) => (
        <Link
          to={`/Communication/${record.lead_id}/`}
          style={{ textDecoration: "none", color: "#007BFF", cursor: "pointer" }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Course",
      dataIndex: "course",
      render: (text) => text ? text : "None",  // If the course is null or undefined, display "None"
    },    
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Email", dataIndex: "lead_email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div
          onClick={(e) => {
            e.stopPropagation(); // Prevent table row click interference
            setSelectedLeadId(record.lead_id); // Set the selected lead ID
            showDrawer();
          }}
          style={{
            cursor: "pointer",
            color: "#007BFF",
          }}
        >
          {text}
        </div>
      ),
    },
    { title: "Remark", dataIndex: "remark_text" },
    {
      title: "Sign",
      dataIndex: "status",
      render: (text) => {
        const statusColorMap = {
          Pending: "#A9A9A9",
          Contacted: "#1E90FF",
          "Follow Up": "#FFA500",
          Converted: "#32CD32",
          Closed: "red",
        };
        return (
          <i
            className="ri-verified-badge-fill"
            style={{
              color: statusColorMap[text],
              fontSize: "1.5em",
            }}
          />
        );
      },
    },
  ];

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 whenever rowsPerPage changes
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/TelecallerPageView", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page + 1, // API expects page to start from 1
          limit: rowsPerPage, // Limit based on the rows per page
        },
      })
      .then((response) => {
        setLeadData(response.data.data || []);  // Ensure data is correctly extracted from response
        setTotalCount(response.data.totalCount || 0);
      })
      .catch((error) => {
        console.error("Error fetching telecaller data:", error);
      });
  }, [token, page, rowsPerPage]); // Run when page or rowsPerPage changes

  useEffect(() => {
    if (selectedLeadId) {
      axios
        .get(`http://127.0.0.1:8000/remarks/${selectedLeadId}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRemarkData(response.data); // Set the remark data for the selected lead
          setRemark(response.data.remark_text); // Pre-fill the remark input field
          setStatus(response.data.status); // Pre-fill the status dropdown
          setDateTime(response.data.created_at); // Pre-fill the date/time field
        })
        .catch((error) => {
          console.error("Error fetching remark data:", error);
        });
    }
  }, [selectedLeadId, token]); // Fetch remark data for selected lead

  const handleRemarkSubmit = () => {
    if (!selectedLeadId) {
      console.warn("No lead selected");
      return;
    }
    console.log(remarkData)
    const url = `http://localhost:8000/remarks/${selectedLeadId}/update_remark/` ;
    const method = remarkData ? "PUT" : "PUT"; // Use PUT if updating an existing remark, POST if adding a new one
    console.log(url)
    axios({
      method: method,
      url: url,
      data: {
        remark_text: remark,
        status: status,
        enquiry_lead: selectedLeadId,
        created_at: date_time,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        message.success("Remark submitted successfully!"); // Show success message
  
        // Update the leadData with the new or updated remark
        const updatedLeadData = leadData.map((lead) => {
          if (lead.lead_id === selectedLeadId) {
            return {
              ...lead,
              remark_text: remark, // Update the remark text
              status: status,      // Update the status
            };
          }
          return lead;
        });
  
        setLeadData(updatedLeadData); // Update the state with new data
  
        setRemarkData({
          ...remarkData,
          remark_text: remark,
          status: status,
          created_at: date_time,
        }); // Update local remarkData
        onClose(); // Close the drawer
      })
      .catch((error) => {
        console.error("Error submitting remark:", error);
        message.error("Failed to submit remark."); // Show error message
      });
  };
  

  return (
    <CustomLayout>
      <div className="telecaller">
        <div className="telecaller_table">
          <Table columns={columns} data={leadData} />
        </div>
        <div className="telecaller_pagination">
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 15, 25]}
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
              value={date_time}
              onChange={(e) => setDateTime(e.target.value)}
              className="textfield"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              id="remark"
              label="Remark"
              variant="outlined"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="textfield"
            />

            <Button type="primary" style={{ marginTop: "20px" }} onClick={handleRemarkSubmit}>
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    </CustomLayout>
  );
};

export default TeleCallerPage;
