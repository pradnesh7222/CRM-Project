import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentForm.scss";

const StudentForm = ({ isVisible, setIsVisible, student }) => {
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  // Error handling state
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    enrollment_status: "",
    lead_id: ""
  });

  // Form data state
  const [formData, setFormData] = useState({
    first_name: student?.first_name || "",
    last_name: student?.last_name || "",
    email:student?.email || "",
    phone_number: student?.phone_number || "",
    date_of_birth: "",
    address: "",
    enrollment_status: "Active",
    lead_id: student?.id || "",
    user: student?.user || "",
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

    const method = student ? "PUT" : "POST";
    const url = student
      ? `http://127.0.0.1:8000/students/${student.id}/`
      : "http://127.0.0.1:8000/students/";

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
        navigate("/StudentTable", { state: { formData } });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);  // Log the error data
        alert(JSON.stringify(errorData));
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
            <h1>{student ? "Edit Details" : "Enter Details"}</h1>
            <button id="closebtn" type="button" onClick={() => setIsVisible(!isVisible)}>
              <i className="ri-close-line"></i>
            </button>
          </div>

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

          <span>Date of Birth</span>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.date_of_birth}</span>

          <span>Address</span>
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.address}</span>

          <span>Enrollment Status</span>
          <select
            name="enrollment_status"
            value={formData.enrollment_status}
            onChange={handleInputChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Graduated">Graduated</option>
            <option value="Dropped">Dropped</option>
          </select>
          <span style={{ color: "red" }}>{error.enrollment_status}</span>

          <span>User ID</span>
          <input
            type="text"
            name="user"
            placeholder="user id"
            value={formData.user}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.user}</span>

          <span>Lead ID</span>
          <input
            type="text"
            name="lead_id"
            placeholder="Lead ID"
            value={formData.lead_id}
            onChange={handleInputChange}
            required
          />
          <span style={{ color: "red" }}>{error.lead_id}</span>

          <button type="submit">{student ? "Update" : "Submit"}</button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
