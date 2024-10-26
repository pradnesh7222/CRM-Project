import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/NavBar";
import "./StudentForm.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const StudentForm = ({ isVisible, setIsVisible, student }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  // Error handling state
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    course: "",
    notes: "",
  });

  // Form data state
  const [formData, setFormData] = useState({
    first_name: student?.first_name || "",
    last_name: student?.last_name || "",
    email: student?.email || "",
    phone_number: student?.phone_number || "",
    address: student?.address || "",
    course: student?.course || "",
    notes: student?.notes || "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        phone_number: student.phone_number || "",
        address: student.address || "",
        course: student.course || "",
        notes: student.notes || "",
      });
    }
  }, [student]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific errors
    setError({ ...error, [name]: "" });
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

    // Email validation
    if (!emailRegex.test(formData.email)) {
      newError.email = "Invalid email format!";
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
        navigate("/Dashboard", { state: { formData } });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="StudentForm">
        <div className="StudentForm_Cont">
          <h1>{student ? "Edit Student" : "Student Form"}</h1>
          <form onSubmit={handleSubmit}>
            <div className="form_Cont">
              <div className="form_Cont_col1">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <label htmlFor="phone_number">Phone</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  placeholder="Enter your phone number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />

                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleInputChange}
                />

                <label htmlFor="enrollment_status">Enrollment Status</label>
                <select
                  id="enrollment_status"
                  name="enrollment_status"
                  value={formData.enrollment_status}
                  onChange={handleInputChange}
                >
                  <option value="">Select enrollment status</option>
                  <option value="Active">Active</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
              <div className="form_Cont_col2">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />

                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />

                <label htmlFor="courses">Courses</label>
                <select
                  id="courses"
                  name="courses"
                  value={formData.courses}
                  onChange={handleInputChange}
                >
                  <option value="">Select a course</option>
                  <option value="MERN Stack">MERN Stack</option>
                  <option value="MEAN Stack">MEAN Stack</option>
                  <option value="Python BackEnd">Python BackEnd</option>
                </select>

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
                  <option value="dn">Dadra and Nagar Haveli and Daman and Diu</option>
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

                <label htmlFor="lead_id">Lead ID</label>
                <input
                  type="text"
                  id="lead_id"
                  name="lead_id"
                  placeholder="Enter your lead ID"
                  value={formData.lead_id}
                  onChange={handleInputChange}
                />

                <label htmlFor="user">User</label>
                <input
                  type="number"
                  id="user"
                  name="user"
                  placeholder="Enter your user ID"
                  value={formData.user}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button type="submit">{student ? "Update" : "Submit"}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentForm;
