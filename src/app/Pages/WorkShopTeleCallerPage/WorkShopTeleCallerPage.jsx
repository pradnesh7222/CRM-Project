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
  const [numberOfLeads, setNumberOfLeads] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [telecaller, setTelecaller] = useState("");

  const [remark, setRemark] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [status, setStatus] = useState("Pending");
  const [selectedLeadId, setSelectedLeadId] = useState(null); // Add state for selected lead ID
  const [tableData, setTableData] = useState();
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
        // console.log(record.id)
        <Link to={`/Communication/${record.id}/`}>{text}</Link> // Pass the 'id' of the student/lead in the URL
      ),
    },

    { title: "amount", dataIndex: "amount" },
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
          "Follow_Up": "#FFA500", // Orange
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

  const data = [
    { id: 1, name: "John Doe", age: 28 },
    { id: 2, name: "Jane Smith", age: 32 },
  ];

  <Table columns={columns} data={data} />;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  

  // Fetch lead data
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/WorkshopTelecallerPageView/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTableData(response.data.data);
        const dataWithKeys = response.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setLeadData(dataWithKeys);
      })
      .catch((error) => {
        console.error("Error fetching telecaller data:", error);
      });
  }, [token]);

  useEffect(() => {
    // fetchRemarks();
  }, [token]);

  // Handle form submission to add new remark
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
          enquiry_lead: selectedLeadId, // Use selectedLeadId here
        },
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // fetchRemarks(); // Refresh the remarks
        setRemark(""); // Clear the input after submission
        setStatus("Pending");
        onClose(); // Close the drawer after submission
      })
      .catch((error) => {
        console.error("Error submitting remark:", error);
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("Selected Rows:", selectedRows);
    },
  };

  return (
    <CustomLayout>
      <div className="telecaller">
        <div className="telecaller_table">
          <Table columns={columns} data={tableData} />
        </div>

        <div className="telecaller_pagination">
          
          <TablePagination
            component="div"
            count={totalCount}
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

export default WorkShopTeleCallerPage;
