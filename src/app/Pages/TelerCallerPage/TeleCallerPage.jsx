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
  const [remarkData, setRemarkData] = useState([]);
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
    { value: "Follow Up", label: "Follow Up" },
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
          to={`/Communication/${record.id}/`}
          style={{ textDecoration: "none", color: "#007BFF", cursor: "pointer" }}
        >
          {text}
        </Link>
      ),
    },
    { title: "Course", dataIndex: "course" },
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Email", dataIndex: "lead_email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div
          onClick={(e) => {
            e.stopPropagation(); // Prevent table row click interference
            showDrawer();
            setSelectedLeadId(record.id);
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
          Follow_Up: "#FFA500",
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
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setLeadData(dataWithKeys);
        setTotalCount(response.data.totalCount || dataWithKeys.length);
      })
      .catch((error) => {
        console.error("Error fetching telecaller data:", error);
      });
  }, [token, page, rowsPerPage]); // Run when page or rowsPerPage changes

  const handleRemarkSubmit = () => {
    if (!selectedLeadId) {
      console.warn("No lead selected");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/remarks/",
        {
          remark_text: remark,
          status: status,
          enquiry_lead: selectedLeadId,
        },
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setRemark("");
        setStatus("Pending");
        onClose();
        message.success("Remark added successfully!");
      })
      .catch((error) => {
        console.error("Error submitting remark:", error);
        message.error("Failed to add remark.");
      });
  };

  const mergedData = leadData.map((lead) => ({
    ...lead,
    status:
      remarkData.find((remark) => remark.enquiry_lead === lead.id)?.status ||
      "No Status",
    remark_text:
      remarkData.find((remark) => remark.enquiry_lead === lead.id)
        ?.remark_text || "No Remark",
  }));

  return (
    <CustomLayout>
      <div className="telecaller">
        <div className="telecaller_table">
          <Table columns={columns} data={mergedData} />
        </div>
        <div className="telecaller_pagination">
        <TablePagination
         component="div"
         count={100}
         page={page}
         onPageChange={handleChangePage}
         rowsPerPage={rowsPerPage}
         onRowsPerPageChange={handleChangeRowsPerPage}
/>
        </div>
        <Drawer title="Add Remark" onClose={onClose} open={open}>
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
              value={date_time} // Use date_time for storing the selected date & time
              onChange={(e) => setDateTime(e.target.value)} // Update the correct state for date_time
              className="textfield"
              InputLabelProps={{
                shrink: true, // Ensures the label positions correctly
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
            <Button onClick={handleRemarkSubmit}>Submit</Button>
          </div>
        </Drawer>
      </div>
    </CustomLayout>
  );
};

export default TeleCallerPage;
