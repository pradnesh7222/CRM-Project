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
    // State to hold API data
    const [data, setData] = useState({
        totalLeads: 0,
        conversionRate: '0%',
        activeStudents: 0,
        placedStudents: 0,
        totalStudentsActiveTillDate:0,
    });
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/conversion_rate/');
                    const result = await response.json();
                    console.log('Dashboard data response:', result);

                    setData({
                        totalLeads: result.totalLeads || 0,
                        conversionRate: result.conversionRate || '0%',
                        activeStudents: result.activeStudents || 0,
                        placedStudents: result.placedStudents || 0,
                        totalStudentsActiveTillDate: result.totalStudentsActiveTillDate || 0,
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
                        />
                        <HomeCard
                            title="Conversion Rate"
                            value={data.conversionRate + "%"}
                            style={{ backgroundColor: '#262c7e67' }}
                        />
                        <HomeCard
                            title="Active Students"
                            value={data.activeStudents}
                        />
                        <HomeCard
                            title="Placed Students"
                            value={data.placedStudents}
                        />
                         <HomeCard
                            title="Total Student Active till date"
                            value={data.totalStudentsActiveTillDate}
                        />
                    </div>

                    <div className="home_right_graphsCont">
                       
                        <div className="home_right_graphsCont_left">
                         <HomeGraph/>
                        </div>
                        <div className="home_right_graphsCont_right">
                            <IndiaMap/>
                        </div>
                    </div>
                    
                    <div className="home_right_graphCont">
                        <div className="home_right_graphCont_left">
                        <HomePieChart/>
                        </div>
                        <div className="home_right_graphCont_right">
                        <HomeLineGraph/>
                        </div>
                       
                    </div>

                    
                </div>
            </div>
        </>
    );
};

export default Home;
