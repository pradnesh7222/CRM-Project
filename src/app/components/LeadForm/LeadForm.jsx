import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeadForm.scss";

const LeadForm = ({ isVisible, setIsVisible, lead }) => {
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  // Error handling state
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    states: "",
    lead_score: "",
    status: "",
    assigned_to_user: "",
  });

  // Form data state
  const [formData, setFormData] = useState({
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    email: lead?.email || "",
    phone_number: lead?.phone_number || "",
    lead_score: lead?.lead_score || "",
    status: lead?.status || "Enquiry",
    assigned_to_user: lead?.assigned_to_user || "",
    notes: lead?.notes || "", // Add notes field
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific errors
    setError({
      ...error,
      [name]: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    let newError = { ...error };

    // Check for empty fields
    for (const key in formData) {
      if (!formData[key]) {
        newError[key] = "This field is required";
        hasError = true;
      }
    }

    // Email and phone validation
    if (!emailRegex.test(formData.email)) {
      newError.email = "Invalid email format!";
      hasError = true;
    }
    if (!phoneRegex.test(formData.phone_number)) {
      newError.phone_number = "Invalid phone number!";
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    const method = lead ? "PUT" : "POST";
    const url = lead
      ? `http://127.0.0.1:8000/leads/${lead.id}/`
      : "http://127.0.0.1:8000/leads/";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Data successfully submitted:", result);
        setIsVisible(false);
        navigate("/Dashboard", { state: { formData } });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData); // Log the error data
        alert(JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="leadFormBg">
      <div className="leadform">
      <div className="closebtn-cont">
      <i className="ri-arrow-left-fill" onClick={() => navigate(0)}></i>
            <h1>{lead ? "Edit Details" : "Enter Details"}</h1>
            <button
              id="closebtn"
              type="button"
              onClick={() => setIsVisible(!isVisible)}
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        <form onSubmit={handleSubmit}>
          

          <div className="form-cont">
         
          <div className="form-left">
              <span>First Name</span>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
              <span style={{ color: "red" }}>{error.first_name}</span>

              <span>Last Name</span>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
              <span style={{ color: "red" }}>{error.last_name}</span>

              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <span style={{ color: "red" }}>{error.email}</span>

              <span>Phone</span>
              <input
                type="text"
                name="phone_number"
                placeholder="Phone"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
              <span style={{ color: "red" }}>{error.phone_number}</span>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-right">
              <label htmlFor="states">States</label>
              <select
                id="states"
                name="states"
                value={formData.states}
                onChange={handleInputChange}
              >
                <option value="">Select a state</option>
                <option value="ap">Andhra Pradesh</option>
                <option value="ar">Arunachal Pradesh</option>
                <option value="as">Assam</option>
                <option value="br">Bihar</option>
                <option value="ch">Chandigarh</option>
                <option value="ct">Chhattisgarh</option>
                <option value="dn">
                  Dadra and Nagar Haveli and Daman and Diu
                </option>
                <option value="dl">Delhi</option>
                <option value="ga">Goa</option>
                <option value="gj">Gujarat</option>
                <option value="hr">Haryana</option>
                <option value="hp">Himachal Pradesh</option>
                <option value="jk">Jammu and Kashmir</option>
                <option value="jh">Jharkhand</option>
                <option value="ka">Karnataka</option>
                <option value="kl">Kerala</option>
                <option value="mp">Madhya Pradesh</option>
                <option value="mh">Maharashtra</option>
                <option value="mn">Manipur</option>
                <option value="ml">Meghalaya</option>
                <option value="miz">Mizoram</option>
                <option value="nl">Nagaland</option>
                <option value="or">Odisha</option>
                <option value="pb">Punjab</option>
                <option value="rj">Rajasthan</option>
                <option value="sk">Sikkim</option>
                <option value="tn">Tamil Nadu</option>
                <option value="tg">Telangana</option>
                <option value="tr">Tripura</option>
                <option value="up">Uttar Pradesh</option>
                <option value="ut">Uttarakhand</option>
                <option value="wb">West Bengal</option>
              </select>

              <span>Lead Score</span>
              <input
                type="number"
                name="lead_score"
                placeholder="Lead Score"
                value={formData.lead_score}
                onChange={handleInputChange}
                required
              />
              <span style={{ color: "red" }}>{error.lead_score}</span>
              <span>Notes</span>
              <input
                type="text"
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
              />
              <span style={{ color: "red" }}>{error.notes}</span>
              <span>Status</span>
              <select
                name="status"
                onChange={handleInputChange}
                value={formData.status}
                required
              >
                <option value="" disabled>
                  --Select an option--
                </option>
                <option value="Enquiry">Enquiry</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Application">Application</option>
              </select>
              <span style={{ color: "red" }}>{error.status}</span>

              <span>Assigned User</span>
              <input
                type="number"
                name="assigned_to_user"
                placeholder="Assigned User ID"
                value={formData.assigned_to_user}
                onChange={handleInputChange}
                required
              />
              <span style={{ color: "red" }}>{error.assigned_to_user}</span>
            </div>
          </div>
          <button type="submit">{lead ? "Update" : "Submit"}</button>

        </form>
      </div>
    </div>
  );
};

export default LeadForm;
