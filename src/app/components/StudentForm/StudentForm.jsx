import React, { useState } from "react";
import Navbar from "../../components/navbar/NavBar";
import "./StudentForm.scss";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    enrollment_status: "",
    dob: "",
    course: "",
    batch: "",
    user: "",
  });

  // Handles input changes for all input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Logs formData in console when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);  // Logs the form data
  };

  return (
    <>
      <Navbar />
      <div className="StudentForm">
        <div className="StudentForm_Cont">
          <h1>Student Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="form_Cont">
              <div className="form_Cont_col1">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Enter your first name"
                  value={formData.firstname}
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

                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
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
                  <option value="enrolled">Enrolled</option>
                  <option value="pending">Pending</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
              <div className="form_Cont_col2">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Enter your last name"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />

                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  placeholder="Enter your date of birth"
                  value={formData.dob}
                  onChange={handleInputChange}
                />

                <label htmlFor="course">Course</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                >
                  <option value="">Select a course</option>
                  <option value="MERN Stack">MERN Stack</option>
                  <option value="MEAN Stack">MEAN Stack</option>
                  <option value="Python BackEnd">Python BackEnd</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Data Science">Data Science</option>
                </select>

                <label htmlFor="batch">Batch</label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  placeholder="Enter your batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                />

                <label htmlFor="user">User</label>
                <input
                  type="text"
                  id="user"
                  name="user"
                  placeholder="Enter your username"
                  value={formData.user}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentForm;
