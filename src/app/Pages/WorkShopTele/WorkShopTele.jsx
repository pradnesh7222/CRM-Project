import React, { useState } from "react";
import "./WorkShopTele.scss";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import { Divider, Radio, Table } from "antd";

const EnquiryTele = () => {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Course",
        dataIndex: "Course",
      },
      {
        title: "Phone",
        dataIndex: "Phone",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Location",
        dataIndex: "Location",
      },
      {
        title: "Amount",
        dataIndex: "Amount",
      },
      {
        title: "Payment Status",
        dataIndex: "Payment_Status",
      },
    ];
  
    const data = [
      {
        key: "1",
        name: "Shivani",
        Course: "Python",
        Phone: 9073568902,
        email: "shivani@gmail.com",
        Location:"Bangalore",
        Amount: 100000,
        Payment_Status: "Not Done",
      },
      {
        key: "2",
        name: "Shivganga",
        Course: "Python",
        Phone: 9073568902,
        email: "London No. 1 Lake Park",
        Location:"Bangalore",
        Amount: 100000,
        Payment_Status: "Not Done",
      },
      {
        key: "3",
        name: "Pradnesh",
        Course: "java",
        Phone: 9073568902,
        email: "Sydney No. 1 Lake Park",
        Location:"Bangalore",
        Amount: 100000,
        Payment_Status: "Not Done",
      },
      {
        key: "4",
        name: "Rishikesh",
        Course: "React Frontend",
        Phone: 9073568902,
        email: "Sydney No. 1 Lake Park",
        Location:"Bangalore",
        Amount: 100000,
        Payment_Status: "Not Done",
      },
    ];
  
    const [telecaller, setTelecaller] = useState();
    const [selectionType, setSelectionType] = useState("checkbox");
  
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === "Disabled User",
        // Column configuration not to be checked
        name: record.name,
      }),
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
              <form>
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
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Doe">Jane Doe</option>
                      <option value="Alex Smith">Alex Smith</option>
                    </select>
                  </div>
                  <div style={{ width: "50%" }}>
                    <label htmlFor="numberOfLeads">Number of leads</label>
                    <input
                      type="number"
                      id="numberOfLeads"
                      placeholder="Number of Leads"
                    />
                  </div>
                </div>
                <div className="leadTable">
                  <div>
                    <Radio.Group
                      onChange={(e) => setSelectionType(e.target.value)}
                      value={selectionType}
                    >
                      {/* <Radio value="checkbox">Checkbox</Radio>
                      <Radio value="radio">radio</Radio> */}
                    </Radio.Group>
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