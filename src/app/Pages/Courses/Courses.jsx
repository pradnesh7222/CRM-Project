import React from "react";
import "./Courses.scss";
import { useEffect ,useState} from "react";
import Navbar from "../../components/navbar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import TrainProCard from "../../components/TrainProCard/TrainProCard";
import web_dev from "../../Assets/CourseImg/web_dev.jpg";
import python from "../../Assets/CourseImg/python_fullStack.jpg";
import Mern_stack from "../../Assets/CourseImg/MERN stack.jpg";
import Mean_stack from "../../Assets/CourseImg/MEAN stack.jpg";
import Data_science from "../../Assets/CourseImg/Data Science.jpg";
import Business_analyst from "../../Assets/CourseImg/Business_analytics.jpg";
import { useNavigate } from "react-router-dom";

const Courses = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCourses = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/?search=${searchQuery}`);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses(); // Updated function name
      }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // setCurrentPage(1);
      };
  return (
    <>
      <Navbar />
      <div className="main">
      <div className="SideBar">
        <SideBar />
      </div>
      <div className="Courses">
      <div className="Courses_header">
      <button onClick={() => navigate("/CourseForm")}>+ Add Course</button> 
            <div className="search-btn">
              <input
                type="search"
                placeholder="search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <i className="ri-search-line"></i>
            </div>
      </div>
      <h1> Our Training Programs</h1>
        <div className="Courses_Cont">
       
        <TrainProCard
          img={web_dev}
          title="Web Development"
          description="Learn the latest web development technologies and frameworks"
          duration="6 months"
          fee="1000"
          instructor="John Doe"
          redirect="https://techentry.in/courses/nodejs-fullstack-mean-mern-course"

        />

        <TrainProCard
          img={Mern_stack}
          title="MERN Full Stack Development"
          description="Learn the latest web development technologies and frameworks"
          duration="6 months"
          fee="1000"
          instructor="John Doe"
          redirect="https://techentry.in/courses/nodejs-fullstack-mean-mern-course"

        />

        <TrainProCard
          img={python}
          title="Python Full Stack Development"
          description="Learn the latest web development technologies and frameworks"
          duration="6 months"
          fee="1000"
          instructor="John Doe"
          redirect="https://techentry.in/courses/python-fullstack-developer-course"

        />

        <TrainProCard
          img={Mean_stack}
          title="MEAN Full Stack Development"
          description="Learn the latest web development technologies and frameworks"
          duration="6 months"
          fee="1000"
          instructor="John Doe"
          redirect="https://techentry.in/courses/nodejs-fullstack-mean-mern-course"

        />

        <TrainProCard
          img={Data_science}
          title=".Net Full Stack Development"
          description="Learn the latest web development technologies and frameworks"
          duration="6 months"
          fee="1000"
          instructor="John Doe"
          redirect="https://techentry.in/courses/dotnet-fullstack-developer-course"

        />

        <TrainProCard
          img={Business_analyst}
          title="Business Analyst"
          description="Learn the latest web development technologies and frameworks"
          duration="6 months"
          fee="1000"
          instructor="John Doe"
          redirect="https://techentry.in/courses/business-analyst-course"

        />
      </div>
      </div>
    </div>
    </>
  );
};

export default Courses;
