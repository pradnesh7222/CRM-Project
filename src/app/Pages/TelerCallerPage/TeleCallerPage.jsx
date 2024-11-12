import React, { useEffect, useState } from "react";
import "./TeleCallerPage.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import { Divider, Radio, Table, Button, Drawer } from "antd";
import TextField from "@mui/material/TextField";
import axios from "axios";

const TeleCallerPage = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const token = localStorage.getItem("authToken");
  const [leadData, setLeadData] = useState([]); 
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a onClick={showDrawer}>{text}</a>,
    },
    {
      title: "Course",
      dataIndex: "course", // Match backend field names exactly
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Remark",
      dataIndex: "remark",
    },
    {
      title: "Sign",
      dataIndex: "sign",
      render: () => (
        <i className="ri-arrow-up-circle-line" style={{ color: "blue", fontSize: "1.5em" }}></i>
      ),
    },
  ];
//     const data = [
//     {
//       key: "1",
//       name: <a onClick={showDrawer}>Shivani</a>,
//       Course: "Python",
//       Phone: 9073568902,
//       email: "shivani@gmail.com",
//       Location: "Bangalore",
//       Status: "Contacted",
//       Remark: "student want any othe course",
//       Sign: (
//         <i
//           class="ri-arrow-up-circle-line"
//           style={{ color: "blue", fontSize: "2vw" }}
//         ></i>
//       ),
//     },
//     {
//       key: "2",
//       name: "Shivganga",
//       Course: "Python",
//       Phone: 9073568902,
//       email: "London No. 1 Lake Park",
//       Location: "Bangalore",
//       Status: "Pending",
//     },
//     {
//       key: "3",
//       name: "Pradnesh",
//       Course: "java",
//       Phone: 9073568902,
//       email: "Sydney No. 1 Lake Park",
//       Location: "Bangalore",
//       Status: "Follow Up",
//     },
//     {
//       key: "4",
//       name: "Rishikesh",
//       Course: "React Frontend",
//       Phone: 9073568902,
//       email: "Sydney No. 1 Lake Park",
//       Location: "Bangalore",
//       Status: "Converted",
//     },
//     {
//       key: "4",
//       name: "Narayan",
//       Course: "React Frontend",
//       Phone: 9073568902,
//       email: "Sydney No. 1 Lake Park",
//       Location: "Bangalore",
//       Status: "Closed",
//     },
//   ];

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
          key: item.id || index, // Use a unique identifier if available
        }));
        setLeadData(dataWithKeys);
      })
      .catch((error) => {
        console.error("Error fetching telecaller data:", error);
      });
  }, [token]);

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
            >
              {/* <Radio value="checkbox">Checkbox</Radio>
              <Radio value="radio">Radio</Radio> */}
            </Radio.Group>
            <Divider />
            <Table
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              columns={columns}
              dataSource={leadData.map((item, index) => ({ ...item, key: index }))} // Use the correct data state
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
        <Drawer title="Lead Details" onClose={onClose} open={open}>
          <div className="form-body">
            <TextField id="name" label="Name" variant="outlined" className="textfield" />
            <TextField id="course" label="Course" variant="outlined" className="textfield" />
            <TextField id="email" label="Email" variant="outlined" className="textfield" />
            <TextField id="phone" label="Phone" variant="outlined" className="textfield" />
            <TextField id="location" label="Location" variant="outlined" className="textfield" />
            <TextField id="status" label="Status" variant="outlined" className="textfield" />
            <TextField id="remark" label="Remark" variant="outlined" className="textfield" />
            <Button onClick={() => console.log("Submit clicked")}>Submit</Button>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default TeleCallerPage;
