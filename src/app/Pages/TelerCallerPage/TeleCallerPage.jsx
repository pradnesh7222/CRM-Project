import React, { useEffect, useState } from "react";
import "./TeleCallerPage.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import { Divider, Radio, Table, Button, Drawer } from "antd";
import TextField from "@mui/material/TextField";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";

const TeleCallerPage = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const token = localStorage.getItem("authToken");
  const [leadData, setLeadData] = useState([]);
  const [remarkData, setRemarkData] = useState([]);
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("Pending");
  const [selectedLeadId, setSelectedLeadId] = useState(null); // Add state for selected lead ID

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
    { value: "Payment confirmed", label: "Payment confirmed" },
    { value: "Closed", label: "Closed" },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
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
    { title: "Course", dataIndex: "course_name" },
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Email", dataIndex: "email" },
    { title: "Location", dataIndex: "location" },
    { title: "Status", dataIndex: "status" },
    { title: "Remark", dataIndex: "remark_text" },
    {
      title: "Sign",
      dataIndex: "sign",
      render: () => (
        <i
          className="ri-arrow-up-circle-line"
          style={{ color: "blue", fontSize: "1.5em" }}
        ></i>
      ),
    },
  ];

  // Fetch lead data
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_unassigned_enquiry_telecaller/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
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

  // Fetch remarks data
  const fetchRemarks = () => {
    axios
      .get("http://127.0.0.1:8000/remarks/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const dataWithKeys = response.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setRemarkData(dataWithKeys);
      })
      .catch((error) => {
        console.error("Error fetching remarks data:", error);
      });
  };

  useEffect(() => {
    fetchRemarks();
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
        fetchRemarks(); // Refresh the remarks
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
    status: remarkData.find((remark) => remark.enquiry_lead === lead.id)?.status || "No Status",
    remark_text: remarkData.find((remark) => remark.enquiry_lead === lead.id)?.remark_text || "No Remark",
  }));

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("Selected Rows:", selectedRows);
    },
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <Navbar />
      </div>
      <div className="telecaller">
        <div className="telecaller_side">
          <SideBar />
        </div>
        <div className="telecaller_table">
          <div style={{ width: "85vw" }}>
            <Radio.Group
              onChange={(e) => setSelectionType(e.target.value)}
              value={selectionType}
            ></Radio.Group>
            <Divider />
            <Table
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              columns={columns}
              dataSource={mergedData}
              pagination={{ pageSize: 10 }}
            />
          </div>
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
    </>
  );
};

export default TeleCallerPage;
