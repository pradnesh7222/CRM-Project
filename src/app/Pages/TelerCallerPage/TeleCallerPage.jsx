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
  const [remarkData, setRemarkData] = useState([]); // New state for remarks data
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState("");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const status = [
    { value: "Pending", label: "Pending" },
    { value: "Contacted", label: "Contacted" },
    { value: "Follow Up", label: "Follow Up" },
    { value: "Payment confirmed", label: "Payment confirmed" },
    { value: "Closed", label: "Closed" },
  ];

  const columns = [
    { title: "Name", dataIndex: "name", render: (text) => <a onClick={showDrawer}>{text}</a> },
    { title: "Course", dataIndex: "course" },
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
  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/remarks/", {
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
  }, [token]);

  // Merge leadData with remarkData
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
        <Drawer title="Lead Details" onClose={onClose} open={open}>
          <div className="form-body">
            <TextField
              id="outlined-select-status"
              select
              label="Status"
              defaultValue="Pending"
              helperText="Please select status"
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="remark"
              label="Remark"
              variant="outlined"
              className="textfield"
            />
            <Button onClick={() => console.log("Submit clicked")}>
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default TeleCallerPage;
