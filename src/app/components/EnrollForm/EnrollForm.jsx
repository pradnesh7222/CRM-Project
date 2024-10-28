import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/NavBar";
import "./EnrollForm.scss";
import { useNavigate } from "react-router-dom";

const EnrollForm = ({ isVisible, setIsVisible, student }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  // State for form data and errors
  const [formData, setFormData] = useState({
    student: student?.student || "", // Store student as a PK
    course: student?.course || "",   // Store course as a PK
    enrollment_date: student?.enrollment_date || "",
    status: student?.status || "",
  });

  const [error, setError] = useState({
    student: "",
    course: "",
    enrollment_date: "",
    status: "",
  });

  // Update form data when `student` prop changes
  useEffect(() => {
    if (student) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        student: student.student || "",
        course: student.course || "",
        enrollment_date: student.enrollment_date || "",
        status: student.status || "",
      }));
    }
  }, [student]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    let newError = { ...error };

    // Validate each field
    for (const key in formData) {
      if (!formData[key] && key !== "notes") {
        newError[key] = "This field is required";
        hasError = true;
      }
    }

    // Email validation
    if (formData.email && !emailRegex.test(formData.email)) {
      newError.email = "Invalid email format!";
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    const method = student ? "PUT" : "POST";
    const url = student
      ? `http://127.0.0.1:8000/enrollments/${student.id}/`
      : "http://127.0.0.1:8000/enrollments/";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: formData.student, // Send as PK directly
          course: formData.course,   // Send as PK directly
          enrollment_date: formData.enrollment_date,
          status: formData.status,
        }),
      });

      if (response.ok) {
        setIsVisible(false);
        navigate("/Dashboard", { state: { formData } });
      } else {
        const errorData = await response.json();
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
          <i className="ri-arrow-left-fill" onClick={() => navigate("/EnrolleTable")}></i>
          <h1>Enrollment</h1>

          <form onSubmit={handleSubmit}>
            <div className="form_Cont_col2">
              <label htmlFor="student">Student</label>
              <input
                type="text"
                id="student"
                name="student"
                placeholder="Enter student ID"
                value={formData.student}
                onChange={handleInputChange}
              />

              <label htmlFor="course">Course</label>
              <input
                type="text"
                id="course"
                name="course"
                placeholder="Enter course ID"
                value={formData.course}
                onChange={handleInputChange}
              />

              <label htmlFor="enrollment_date">Enrollment Date</label>
              <input
                type="date"
                id="enrollment_date"
                name="enrollment_date"
                value={formData.enrollment_date}
                onChange={handleInputChange}
              />

              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select a status</option>
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
                <option value="dropped_out">Dropped Out</option>
              </select>
            </div>

            <button type="submit">{student ? "Update" : "Submit"}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EnrollForm;
