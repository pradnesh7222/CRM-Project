import React, { useState, useEffect } from "react";
import "./EnquiryTele.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import { Divider, Radio, Table, message } from "antd";
import axios from "axios";

const EnquiryTele = () => {
  const [telecaller, setTelecaller] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [data, setData] = useState([]);
  const token = localStorage.getItem("authToken");
  const [numberOfLeads, setNumberOfLeads] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    // Update selectedRowKeys when numberOfLeads or data changes
    setSelectedRowKeys(data.slice(0, numberOfLeads).map((item, index) => index));
  }, [numberOfLeads, data]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/EnquiryTelecaller/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTelecaller(response.data);
      })
      .catch((error) => {
        console.error("Error fetching telecaller data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/leads/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leads data:", error);
      });
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name", render: (text) => <a>{text}</a> },
    { title: "Course", dataIndex: "course" },
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Email", dataIndex: "email" },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setNumberOfLeads(selectedRows.length);
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedLeads = selectedRowKeys.map((key) => data[key]);

    const payload = {
      telecaller,
      numberOfLeads,
      leads: selectedLeads,
    };

    axios
      .post("http://127.0.0.1:8000/assign_leads", payload, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        message.success("Leads assigned successfully");
      })
      .catch((error) => {
        message.error("Failed to assign leads");
        console.error("Error assigning leads:", error);
      });
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <Navbar />
      </div>
      <div className="telemain">
        <div className="telemain_sidecont">
          <SideBar />
        </div>
        <div className="telemain_right">
          <div className="telemain_right_up">
            <form onSubmit={handleSubmit}>
              <div className="assignTeleCont">
                <div style={{ width: "50%" }}>
                  <label htmlFor="telecaller">Select Telecaller</label>
                  <select
                    name="telecaller"
                    id="telecaller"
                    value={telecaller}
                    onChange={(e) => setTelecaller(e.target.value)}
                  >
                    <option value="">Select Telecaller</option>
                    {Array.isArray(telecaller) &&
                      telecaller.map((tc) => (
                        <option key={tc.id} value={tc.name}>
                          {tc.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div style={{ width: "50%" }}>
                  <label htmlFor="numberOfLeads">Number of leads</label>
                  <input
                    type="number"
                    id="numberOfLeads"
                    placeholder="Number of Leads"
                    value={numberOfLeads}
                    onChange={(e) => setNumberOfLeads(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="leadTable">
                <Radio.Group
                  onChange={(e) => setSelectionType(e.target.value)}
                  value={selectionType}
                >
                </Radio.Group>
                <Divider />
                <Table
                  rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                  }}
                  columns={columns}
                  dataSource={data.map((item, index) => ({ ...item, key: index }))} // Pass data with unique keys
                  pagination={{ pageSize: 10 }}
                />
              </div>
              <div className="submit-button">
                <button type="submit">Assign Leads</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryTele;
