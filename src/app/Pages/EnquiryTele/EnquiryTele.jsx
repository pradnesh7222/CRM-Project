import React, { useState, useEffect } from "react";
import "./EnquiryTele.scss";
import CustomLayout from "../../components/CustomLayout/CustomLayout";
import TablePagination from "@mui/material/TablePagination";
import { message } from "antd";
import axios from "axios";

const EnquiryTele = () => {
  const [telecaller, setTelecaller] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("authToken");
  const [numberOfLeads, setNumberOfLeads] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [manualSelection, setManualSelection] = useState(false);

  // useEffect(() => {
  //   if (!manualSelection) {
  //     setSelectedRowKeys(data.slice(0, numberOfLeads).map((_, index) => index));
  //   }
  // }, [numberOfLeads, data, manualSelection]);

  // const handleSelectLead = (index) => {
  //   let newSelectedRowKeys = [...selectedRowKeys];
  //   let updatedNumberOfLeads = numberOfLeads;

  //   if (newSelectedRowKeys.includes(index)) {
  //     newSelectedRowKeys = newSelectedRowKeys.filter((key) => key !== index);
  //     updatedNumberOfLeads = Math.max(0, updatedNumberOfLeads - 1); // Decrease the count but ensure it doesn't go below 0
  //   } else if (newSelectedRowKeys.length < numberOfLeads) {
  //     newSelectedRowKeys.push(index);
  //   }

  //   setSelectedRowKeys(newSelectedRowKeys);
  //   setNumberOfLeads(updatedNumberOfLeads); // Update the input box value
  // };

  const handleNumberOfLeadsChange = (e) => {
    const numLeads = Number(e.target.value);
    setNumberOfLeads(numLeads);

    // Automatically select the number of leads entered
    const updatedSelection = data.slice(0, numLeads).map((_, index) => index);
    setSelectedRowKeys(updatedSelection);
  };

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
      .get("http://127.0.0.1:8000/get_unassigned_enquiry_telecaller/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setTotalCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching leads data:", error);
      });
  }, []);

  // const handleSelectAll = (e) => {
  //   const isChecked = e.target.checked;
  //   const keys = data.slice(0, numberOfLeads).map((_, index) => index);
  //   setSelectedRowKeys(isChecked ? keys : []);
  // };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const handleRowSelection = (index) => {
    const updatedSelection = selectedRowKeys.includes(index)
      ? selectedRowKeys.filter((key) => key !== index)
      : [...selectedRowKeys, index];
    setSelectedRowKeys(updatedSelection);
    setNumberOfLeads(updatedSelection.length);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
      .post("http://127.0.0.1:8000/get_leads_by_telecaller/", payload, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        message.success("Leads assigned successfully");
      })
      .catch((error) => {
        message.error("Failed to assign leads");
        console.error("Error assigning leads:", error);
      });
  };

  return (
    <CustomLayout>
      <div className="enquiryTele">
        <div className="enquiryTele_right">
          <div className="enquiryTele_right_up">
            <div className="enquiryTele_right_up_form" onSubmit={handleSubmit}>
              <div className="assignTeleCont1">
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
              <div className="assignTeleCont2">
                <label htmlFor="numberOfLeads">Number of leads</label>
                <input
                  type="number"
                  id="numberOfLeads"
                  placeholder="Number of Leads"
                  value={numberOfLeads}
                  onChange={handleNumberOfLeadsChange}
                />
                ;
              </div>
            </div>
          </div>
          <div className="enquiryTele_right_leadTable">
            <table>
              <thead>
                <tr>
                  <th>
                    select
                    {/* <input
                      type="checkbox"
                      name="select-all"
                      id="select-all"
                      onChange={handleSelectAll}
                    /> */}
                  </th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRowKeys.includes(index)}
                          onChange={() => handleRowSelection(index)}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.course_name}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="enquiryTele_right_pagination">
            <div className="submit-button">
              <button
                type="submit"
                onClick={handleSubmit}
                style={{
                  opacity:
                    !telecaller || selectedRowKeys.length === 0 ? 0.5 : 1,
                  cursor:
                    !telecaller || selectedRowKeys.length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Assign Leads
              </button>
            </div>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default EnquiryTele;
