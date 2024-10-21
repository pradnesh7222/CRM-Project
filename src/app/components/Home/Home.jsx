    import React, { useState } from 'react'
    import './Home.scss'
    import Navbar from '../navbar/NavBar'
    import SideBar from '../SideBar/SideBar'
    import HomeCard from '../HomeCard/HomeCard'
   


    const Home = () => {

        //     options: {
        //         colors: ["#6D2E6A" , "#242872"],
        //         chart: {
        //             id: "basic-bar"
        //         },
                
        //     },
        //     series: [
        //         {
        //             name: "series-1",
        //             data: [30, 40, 45, 50, 49, 60, 70, 91]
        //         },
        //         {
        //             name: "series-2",
        //             data: [50, 30, 45, 20, 60, 80, 60, 91]
        //         }
        //     ],
            
        // });
    return (
        <>
        <Navbar/>
        <div className="home">
        <div className="home_left">
            <SideBar/>
        </div>
        <div className="home_right">
            <div className="home_right_cardCont">
                <HomeCard
                title="Total Leads"
                value="1000"
                />
                <HomeCard
                title="Conversion Rate"
                value="50%"
                />
                <HomeCard
                title="Active Students"
                value="50"
                />
                <HomeCard
                  title="Placed Students"
                  value="20+"
                  
                />
            </div>
          
            
        </div>
        </div>
        </>
    )
    }

    export default Home