import React, { useEffect, useState } from "react";
import "./LeadForm.scss";
import { useNavigate } from "react-router-dom";

const LeadForm = ({ isVisible, setIsVisible, customer }) => {
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navigate = useNavigate();

  // Separate state for handling errors
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    status: "",
  });

  // State for storing form data
  const [formData, setFormData] = useState({
    firstName: customer?.first_name || "",
    lastName: customer?.last_name || "",
    email: customer?.email || "",
    phone: customer?.phone_number || "",
    address: customer?.address || "",
    status: customer?.status || "",
  });

  // Handle input change and update formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the specific error if the user starts typing
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

    // Validate email format
    if (!emailRegex.test(formData.email)) {
      newError.email = "Invalid email format!";
      hasError = true;
    }

    // Validate phone number format
    if (!phoneRegex.test(formData.phone)) {
      newError.phone = "Invalid phone number! It should be 10 digits.";
      hasError = true;
    }

    // If there's any validation error, set the errors
    if (hasError) {
      setError(newError);
      return;
    }

    // Determine whether to create or update
    const method = customer ? "PATCH" : "POST"; // Use PATCH if editing
    const url = customer
      ? `http://127.0.0.1:8000/customers/${customer.id}/` // Update URL for edit
      : "http://127.0.0.1:8000/customers/"; // URL for new customer

    // Proceed if no errors and send the data to the backend API
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          address: formData.address,
          status: formData.status,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Data successfully submitted:", result);

        // Close modal only after successful submission
        setIsVisible(false);
        navigate("/Dashboard", { state: { formData: formData } });
      } else {
        console.error("Failed to submit data:", response.status);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="leadFormBg">
      <div className="leadform">
        <form onSubmit={handleSubmit}>
          <div className="closebtn-cont">
            <h1>{customer ? "Edit Details" : "Enter Details"}</h1>
            <button id="closebtn" type="button" onClick={() => setIsVisible(!isVisible)}>
              <i className="ri-close-line"></i>
            </button>
          </div>

          <span>First Name</span>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.firstName}</span>

          <span>Last Name</span>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.lastName}</span>

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
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.phone}</span>

          <span>Address</span>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.address}</span>

          <span>Status</span>
          <select name="status" onChange={handleInputChange} value={formData.status} required>
            <option value="">--Select an option--</option>
            <option value="New">New</option>
            <option value="Connected">Connected</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <span style={{ color: "red" }}>{error.status}</span>

          <button type="submit">
            {customer ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
