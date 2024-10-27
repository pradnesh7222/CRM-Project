import React, { useState } from 'react';
import './AddCourse.scss';
import Navbar from '../../components/navbar/NavBar';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    Instructor: '', // Ensure this matches your backend expectations
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the FormData object for submission
    const data = new FormData();
    console.log('Form Data:', formData); 
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('Instructor', formData.Instructor); // Ensure this is 'Instructor'
    if (formData.image) {
      data.append('image', formData.image);
    }
    console.log('Form Data being sent:', {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      Instructor: formData.Instructor, // Ensure this is 'Instructor'
      image: formData.image,
    });
    
    try {
      const response = await fetch('http://127.0.0.1:8000/courses/', {
        method: 'POST',
        body: data,
      });
  
      if (response.ok) {
        navigate('/courses', { state: formData });
      } else {
        const errorData = await response.json();  // Parse error response
        console.error('Error submitting form:', errorData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="addCourseForm">
        <div className="formCont">
          <i className="ri-arrow-left-fill" onClick={() => navigate("/Courses")}></i>
          <h1>Add Course</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" placeholder="Enter course name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea className="form-control" id="description" rows="3" placeholder="Enter course description" name="description" value={formData.description} onChange={handleInputChange}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input type="number" className="form-control" id="price" placeholder="Enter course price" name="price" value={formData.price} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="Instructor">Instructor</label>
              <input type="number" className="form-control" id="Instructor" placeholder="Enter Instructor ID" name="Instructor" value={formData.Instructor} onChange={handleInputChange} />
            </div>
            <div className="form-group1">
              <label htmlFor="image">Image</label>
              <input type="file" className="form-control-file" id="image" name="image" onChange={handleInputChange} />
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCourse;
