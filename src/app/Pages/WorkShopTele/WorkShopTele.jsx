import React, { useState, useEffect } from "react";
import "./WorkShopTele.scss";
import { message } from "antd";
import TablePagination from "@mui/material/TablePagination";
import CustomLayout from "../../components/CustomLayout/CustomLayout";
import axios from "axios";

const WorkShopTele = () => {
  const [telecaller, setTelecaller] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState([]);
  const [numberOfLeads, setNumberOfLeads] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const token = localStorage.getItem("authToken");

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
      .catch((error) =>
        console.error("Error fetching telecaller data:", error)
      );
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_unassigned_workshop_telecaller/", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching leads data:", error));
  }, []);

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

  const handleNumberOfLeadsChange = (e) => {
    const numLeads = Number(e.target.value);
    setNumberOfLeads(numLeads);

    // Automatically select the number of leads entered
    const updatedSelection = data.slice(0, numLeads).map((_, index) => index);
    setSelectedRowKeys(updatedSelection);
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
      .post("http://127.0.0.1:8000/get_workshopleads_by_telecaller/", payload, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        message.success("Leads assigned successfully");
        setSelectedRowKeys([]);
        setNumberOfLeads(0);
      })
      .catch((error) => {
        message.error("Failed to assign leads");
        console.error("Error assigning leads:", error);
      });
  };

  return (
    <CustomLayout>
      <div className="workShopTele">
        <div className="workShopTele_right">
          <div className="workShopTele_right_up">
            <form
              className="workShopTele_right_up_form"
              onSubmit={handleSubmit}
            >
              <div className="workShopTele_right_up_form_assignTeleCont1">
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
              <div className="workShopTele_right_up_form_assignTeleCont2">
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
            </form>
          </div>
          <div className="workShopTele_right_leadTable">
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Order Date</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
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
                      <td>{item.customerName}</td>
                      <td>{item.orderDate}</td>
                      <td>{item.customerNumber}</td>
                      <td>{item.customerEmail}</td>
                      <td>{item.location}</td>
                      <td>{item.amount}</td>
                      <td>{item.paymentStatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="workShopTele_right_pagination">
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

export default WorkShopTele;
