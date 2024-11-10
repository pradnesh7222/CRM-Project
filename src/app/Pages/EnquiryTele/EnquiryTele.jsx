import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EnquiryTele.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import { Divider, Radio, Table, message } from "antd";

const EnquiryTele = () => {
  const [data, setData] = useState([]);
  const [telecaller, setTelecaller] = useState();
  const [telecallers, setTelecallers] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [numberOfLeads, setNumberOfLeads] = useState("");
  const token = localStorage.getItem("authToken");

  const fetchTelecallers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/EnquiryTelecaller/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTelecallers(response.data || []);
    } catch (error) {
      console.error("Error fetching telecallers data:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/leads/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching leads data:", error);
    }
  };

  useEffect(() => {
    fetchTelecallers();
    fetchLeads();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedLeads(selectedRows);
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HandleSubmit triggered");

    if (!telecaller || !numberOfLeads || selectedLeads.length === 0) {
      message.warning("Please select a telecaller, number of leads, and at least one lead.");
      return;
    }

    const leadIds = selectedLeads.map((lead) => lead.id);

    try {
      await axios.post(
        "http://127.0.0.1:8000/get_leads_by_telecaller/",
        {
          telecaller,
          lead_ids: leadIds,
          number_of_leads: numberOfLeads,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Leads assigned successfully!");
      setTelecaller("");
      setNumberOfLeads("");
      setSelectedLeads([]);
    } catch (error) {
      console.error("Error assigning leads:", error);
      message.error("Failed to assign leads. Please try again.");
    }
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
            {/* Added a console log here to check if the form renders correctly */}
            <form
             
            >
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
                    {telecallers.length > 0 ? (
                      telecallers.map((tc) => (
                        <option key={tc.id} value={tc.name}>
                          {tc.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading telecallers...</option>
                    )}
                  </select>
                </div>
                <div style={{ width: "50%" }}>
                  <label htmlFor="numberOfLeads">Number of leads</label>
                  <input
                    type="number"
                    id="numberOfLeads"
                    placeholder="Number of Leads"
                    value={numberOfLeads}
                    onChange={(e) => setNumberOfLeads(e.target.value)}
                  />
                </div>
              </div>
              <div className="leadTable">
                <div>
                  <Radio.Group
                    onChange={(e) => setSelectionType(e.target.value)}
                    value={selectionType}
                  />
                  <Divider />
                  <Table
                    rowSelection={{
                      type: selectionType,
                      ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                  />
                </div>
              </div>
              
            </form>
            
            <button onClick={handleSubmit}>Assign Leads</button>
        
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryTele;
