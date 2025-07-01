import hamburgericon from '../assets/hamburgericon.svg';
import upload from '../assets/upload.svg';
import logbook from '../assets/logbook.svg';
import history from '../assets/history.svg';
import logout from '../assets/logout.svg';
import React, { useState } from "react";
import axios from 'axios';
import { URL } from "../../api/APIconst";
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [isHovered, setIsHovered] = useState(false);
    const nav = useNavigate();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleLogout = async () => {
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`
            const response = await axios.post(`${URL}/auth/logout`);

            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('pretestScore');

            if (response.status === 200) {
                window.location.href = '/login';
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const navigatePrediction = async () => {
        try {
            const token = localStorage.getItem('token');

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            const response = await axios.get(URL+"/logbooks/get/1").catch((e) => console.error(e))
            console.log(response.data);
            if (response.statusText != "OK") throw new Error(`Response status: ${response.status}`);

            const last_patient = response.data[0].last_patient;
            const patient_count = response.data[0].patient_count + 1;
            const logbook_id = response.data[0].logbook_id;

            if (last_patient && patient_count && logbook_id) {
                nav(`/prediction`, { state: { last_patient, patient_count, logbook_id } });
            } else {
                console.warn("No last_patient found for logbook:", logbook_id);
            }   
        } catch (error) {
            console.error("Error fetching logbook state:", error);
        }
    }

    return (
        <div className="absolute h-full bg-secondary w-48">
            <div className="flex flex-col items-center relative justify-center" onMouseLeave={handleMouseLeave}>
                
                {isHovered ? (
                    <div className="flex flex-col items-center gap-36 justify-center absolute top-20">
                        <div className="nav-icon">
                            {/* <a href="/prediction"></a> */}
                            <button onClick={navigatePrediction}>
                                <img src={upload} className='w-30' />
                            </button>
                        </div>
                        <div className="nav-icon">
                            <a href="/doctorlogbook"><img src={logbook} className='w-30'/></a>
                        </div>
                        <div className="nav-icon">
                            <a href="/patienthistory"><img src={history} className='w-30'/></a>
                        </div>
                        <div className="nav-icon">
                            <button onClick={handleLogout}><img src={logout} className='w-30'/></button>
                        </div>
                    </div>
                ) : (
                    <div className="absolute top-20" onMouseEnter={handleMouseEnter}>
                        <img src={hamburgericon} className='w-30'/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar;