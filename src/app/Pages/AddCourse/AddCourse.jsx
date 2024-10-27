import React,{useState} from 'react'
import './AddCourse.scss'
import Navbar from '../../components/navbar/NavBar';
import { useNavigate } from 'react-router-dom';


const AddCourse = () => {
  const navigate= useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    instructor: '',
    details: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/courseCard', { state: formData });
    
  };


  
  return (
    <>
    <Navbar/>
    <div className='addCourseForm'>
       <div className="formCont">
       <i className="ri-arrow-left-fill" onClick={() => navigate("/Courses")}></i>
       <h1>Add Course</h1>
         <form >
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
            <label htmlFor="instructor">Instructor</label>
            <input type="text" className="form-control" id="instructor" placeholder="Enter instructor name" name="instructor" value={formData.instructor} onChange={handleInputChange} />
         </div>
         <div className="form-group">
            <label htmlFor="details">Course Details</label>
            <textarea className="form-control" id="details" rows="3" placeholder="Enter course details" name="details" value={formData.details} onChange={handleInputChange}></textarea>
         </div>
         <div className="form-group1">
            <label htmlFor="image">Image</label>
            <input type="file" className="form-control-file" id="image" name="image" onChange={handleInputChange} />
         </div>
         <button onSubmit={handleSubmit} type="submit" className="submit-btn">Submit</button>
         </form>
      </div>
    </div>
    </>
  )
}

export default AddCourse