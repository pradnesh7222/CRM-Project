import React, { useState, useEffect } from 'react';
import './Home.scss';
import Navbar from '../navbar/NavBar';
import SideBar from '../SideBar/SideBar';
import HomeCard from '../HomeCard/HomeCard';

const Home = () => {
    // State to hold API data
    const [data, setData] = useState({
        totalLeads: 0,
        conversionRate: '0%',
        activeStudents: 0,
        placedStudents: 0,
    });

    // Fetch data from backend APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/conversion_rate/'); // Adjusted to a single endpoint
                const result = await response.json();
                console.log('Dashboard data response:', result);

                // Set state with fetched data
                setData({
                    totalLeads: result.totalLeads || 0,
                    conversionRate: result.conversionRate || '0%',
                    activeStudents: result.activeStudents || 0,
                    placedStudents: result.placedStudents || 0,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on component mount

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
                        />
                        <HomeCard
                            title="Conversion Rate"
                            value={data.conversionRate}
                        />
                        <HomeCard
                            title="Active Students"
                            value={data.activeStudents}
                        />
                        <HomeCard
                            title="Placed Students"
                            value={data.placedStudents}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
