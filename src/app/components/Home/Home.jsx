// Home.js
import React, { useState, useEffect, useRef } from 'react';
import './Home.scss';
import Navbar from '../navbar/NavBar';
import SideBar from '../SideBar/SideBar';
import HomeCard from '../HomeCard/HomeCard';
import IndiaMap from '../IndiaMap/IndiaMap';
import HomeGraph from '../HomeGraph/HomeGraph';
import HomePieChart from '../HomePieChart/HomePieChart';
import HomeLineGraph from '../HomeLineGraph/HomeLineGraph';

const Home = () => {
    const token = localStorage.getItem('authToken');
    const [data, setData] = useState({
        totalLeads: 0,
        conversionRate: '0%',
        activeStudents: 0,
        graduatedStudents: 0,
        total_students_active_till_date: 0,
    });
    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/PercentageOfConversionofLeadToStudents /', {
                        method: 'GET', // Optional as GET is default, but included for clarity
                        headers: {
                            'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
                            'Content-Type': 'application/json',  // Optional if server expects JSON content
                        }
                    });
                    const result = await response.json();
                    console.log('Dashboard data response:', result);

                    setData({
                        totalLeads: result.totalLeads || 0,
                        conversionRate: result.conversionRate || '0%',
                        activeStudents: result.activeStudents || 0,
                        graduatedStudents: result.graduatedStudents || 0,
                        total_students_active_till_date: result.total_students_active_till_date || 0,
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
            hasFetchedData.current = true; // Mark as fetched
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="home">
                <div className="home_left">
                    <SideBar />
                </div>
                <div className="home_right">
                    <div className="home_right_cardCont">
                        <HomeCard
                            title="Total Leads"
                            value={data.totalLeads}
                            redirectUrl="/Dashboard"
                        />
                        <HomeCard
                            title="Conversion Rate"
                            value={`${data.conversionRate}%`}
                            redirectUrl="/StudentTable"
                        />
                        <HomeCard
                            title="Active Students"
                            value={data.activeStudents}
                            redirectUrl="/StudentTable"
                            filter={{ enrollment_status: 'Active' }} // Add filter for active students
                        />
                        <HomeCard
                            title="Placed Students"
                            value={data.graduatedStudents}
                            redirectUrl="/StudentTable"
                            filter={{ enrollment_status: 'Graduated' }} // Add filter for graduated students
                        />
                        <HomeCard
                            title="Total Student Active till date"
                            value={data.total_students_active_till_date}
                            redirectUrl="/StudentTable"
                        />
                    </div>

                    <div className="home_right_graphsCont">
                        <div className="home_right_graphsCont_left">
                            <HomeGraph />
                        </div>
                        <div className="home_right_graphsCont_right">
                            <IndiaMap />
                        </div>
                    </div>

                    <div className="home_right_graphCont">
                        <div className="home_right_graphCont_left">
                            <HomePieChart />
                        </div>
                        <div className="home_right_graphCont_right">
                            <HomeLineGraph />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
