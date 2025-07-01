import React, { useState, useEffect } from 'react';
import DoctorPretest from "../components/DoctorPretest";
import Navbar from '../components/Navbar';
import { URL } from "../../api/APIconst"
import axios from "axios"

function Pretest() {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [pretestData, setPretestData] = useState([]);
    const totalQuestions = pretestData.length;

    // useEffect(() => {
    //     fetch('pretest')
    //         .then(response => response.json())
    //         .then(data => setPretestData(data))
    //         .catch(error => console.error('Error fetching pretest data:', error));
    // }, []);

    useEffect(() => {
        const fetchPretest = async () => {
            try {
                const pretestData = await axios.get(`${URL}/pretest`);
                setPretestData(pretestData.data);
            } catch (e) {
                console.error('Error fetching pretest data:', e);
            }
        };
        fetchPretest();
    }, []);

    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(currentQuestion + 1);
            setCurrentImageIndex(0); // Reset image index when moving to the next question
        } else {
            alert("Submit the test!");
        }
    };

    const handleBack = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
            setCurrentImageIndex(0); // Reset image index when moving to the previous question
        }
    };

    const handleNextImage = () => {
        const currentPretest = pretestData[currentQuestion - 1];
        if (currentPretest && currentImageIndex < currentPretest.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const currentPretest = pretestData.find(data => data.pre_test_id === currentQuestion);

    console.log('total Questions:', totalQuestions);
    console.log('pretestData: ', pretestData);
    console.log('currentPretest: ', currentPretest);

    return (
        <div className="bg-tertiary min-h-screen relative overflow-y-auto">
            {/* <Navbar /> */}

            <div className="absolute h-full bg-secondary w-48">
                <div className="flex flex-col items-center relative">
                </div>
            </div>
            
            <div className="pl-64 w-screen min-h-screen py-20 pr-20">
                {currentPretest && (
                    <DoctorPretest
                        allPretestData={pretestData}
                        currentQuestion={currentQuestion}
                        totalQuestions={totalQuestions}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        currentPretest={currentPretest}
                        currentImageIndex={currentImageIndex}
                        handleNextImage={handleNextImage}
                        handlePrevImage={handlePrevImage}
                        pretestData={currentPretest.images} // Passing images for the current question
                    />
                )}
            </div>
        </div>
    );
}

export default Pretest;
