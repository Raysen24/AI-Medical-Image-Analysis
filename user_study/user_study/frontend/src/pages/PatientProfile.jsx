import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import axios from "axios";
import {URL} from "../../api/APIconst";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PatientProfile() {
    const { patientID } = useParams(); 
    const [images, setImages] = useState([])
    const [binaryPrediction, setBinaryPrediction] = useState({})
    const [multiclassPrediction, setMulticlassPrediction] = useState({})
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchPatientDetail = async () => {

            const token = localStorage.getItem('token');
            
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            const response = await axios.get(URL+"/predict/patient/data/"+patientID).catch((e) => console.error(e))
            console.log(response)
            if (response.statusText != "OK") throw new Error(`Response status: ${response.status}`);

            const content = response.data;
            setBinaryPrediction({
                confidence_rate: content.binary_confidence_rate,
                result: content.binary_result,
                comment: content.binary_comment
            });

            setMulticlassPrediction({
                confidence_rate: content.multiclass_confidence_rate,
                result: content.multiclass_result,
                comment: content.multiclass_comment
            });

            setImages(content.images);
            
            console.log(content);
        }
        
        fetchPatientDetail()
    }, [patientID])

    const handleImageClick = (url) => {
        setPreviewImage(url);
    };
    

    return (
        <>
            <div className="bg-tertiary min-h-screen relative overflow-y-auto">
                <Navbar />
                <div className="pl-64 w-screen min-h-screen pb-20 pt-10 pr-20">
                    <Profile 
                        patientID={patientID}
                        binaryPrediction={binaryPrediction}
                        multiclassPrediction={multiclassPrediction}
                        images={images}
                        previewImage={previewImage}
                        handleImageClick={handleImageClick}
                    />
                </div>
            </div>
        </>
    )
}

export default PatientProfile;