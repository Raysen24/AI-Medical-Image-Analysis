import UploadImage from "../components/UploadImage";
import React, { useState, useEffect } from "react";
import PredictionResults from "../components/PredictionResults";
import { useNavigate, useLocation } from "react-router-dom";
import CompletionModal from "../components/CompletionModal";
import Navbar from "../components/Navbar";
import { Button, useDisclosure, Spinner } from "@nextui-org/react";
import { uploadImage, deleteImage, fetchImagesFromS3 } from "../../api/image"; 
import { predictImageBinary, predictImageMulticlass, updateBinary, updateMulticlass } from "../../api/predict"; 
import axios from "axios"
import { URL } from "../../api/APIconst"

function Prediction() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [images, setImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const location = useLocation();
    const [lastPatient, setLastPatient] = useState(location.state?.last_patient || -1);
    const [patientCount, setPatientCount] = useState(location.state?.patient_count || -1);
    const [logbookId, setLogbookId] = useState(location.state?.logbook_id || -1);
    const [isPredict, setIsPredict] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [binaryId, setBinaryId] = useState(-1);
    const [multiclassId, setMulticlassId] = useState(-1);
    const maxImages = 5;
    const nav = useNavigate();

    // States for predictions and tracking changes
    const initialBinaryPredictions = [
        { probability: 78, disease: "abnormal", binary_id: -1, sesuai_tidaksesuai: "", comment: "" },
    ];
    const initialMulticlassPredictions = [
        { probability: 60, disease: "cubili dextra", multiclass_id: -1, sesuai_tidaksesuai: "", comment: "" },
    ];

    const [binaryPredictions, setBinaryPredictions] = useState(initialBinaryPredictions);
    const [multiclassPredictions, setMulticlassPredictions] = useState(initialMulticlassPredictions);
    
    // Local state to track unsaved changes
    const [pendingChanges, setPendingChanges] = useState({
        binary: [],
        multiclass: [],
    });

    useEffect(() => {
        // If there's a last patient passed from the LogbookContent page, set it
        if (location.state?.patient_count && location.state?.logbook_id && location.state?.last_patient) {
            setPatientCount(location.state.patient_count);
            setLogbookId(location.state.logbook_id);
            setLastPatient(location.state.last_patient);
        }
    }, [location.state]);
    
    useEffect(() => {
        const fetchImages = async () => {
            const fetchedImages = await fetchImagesFromS3(lastPatient);
            setImages(fetchedImages);   
        };

        fetchImages();
    }, [lastPatient]);

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (images.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }

        const newImages = [];
        for (const file of files) {
            try {
                const response = await uploadImage(lastPatient, file);
                newImages.push({
                    name: file.name,
                    url: window.URL.createObjectURL(file),
                });
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image.");
            }
        }

        setImages([...images, ...newImages]);
    };

    const handleImageDelete = async (image_id) => {
        try {
            await deleteImage(image_id);
            const newImages = images.filter((image) => image.id !== image_id);
            setImages(newImages);
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image.");
        }
    };

    const handleImageClick = (url) => {
        setPreviewImage(url);
    };

    const handleNextPatient = async () => {
        // Save changes before moving to the next patient
        setShowResults(false);
        await saveChanges();

        if (patientCount < 30) {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const response = await axios.post(`${URL}/logbooks/next/${logbookId}`, )
            if (response.status === 200) {
                console.log('Logbook patient counter added successfully:', response.data);
            }
            
            setPatientCount(patientCount + 1);
            setImages([]);
        } else {
            onOpen(); // Open completion modal if 30 patients are reached
        }
    };

    const saveChanges = async () => {
        try {
            // Save binary predictions changes
            for (const change of pendingChanges.binary) {
                await updateBinary(change.id, change.comment, change.sesuai_tidaksesuai);
            }

            // Save multiclass predictions changes
            for (const change of pendingChanges.multiclass) {
                await updateMulticlass(change.id, change.comment, change.sesuai_tidaksesuai);
            }

            // Reset pending changes
            setPendingChanges({ binary: [], multiclass: [] });
            console.log("Changes saved successfully.");
        } catch (error) {
            console.error("Failed to save changes:", error);
        }
    };

    const handleContinue = async () => {
        onClose();

        const token = localStorage.getItem('token');
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const nextResponse = await axios.post(`${URL}/logbooks/next/${logbookId}`, )
        if (nextResponse.status === 200) {
            console.log('Logbook patient counter next successfully:', nextResponse.data);
        }

        const addPatientResponse = await axios.get(`${URL}/logbooks/get/id/${logbookId}`, )
        if (addPatientResponse.status === 200) {
            console.log('Logbook patient counter added successfully:', addPatientResponse.data);
        }

        setLastPatient(addPatientResponse.data.last_patient);
        setPatientCount(patientCount + 1);
    };

    const handleDone = async () => {
        onClose();

        const token = localStorage.getItem('token');
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const addPatientResponse = await axios.post(`${URL}/logbooks/add/${logbookId}`, )
        if (addPatientResponse.status === 200) {
            console.log('Logbook patient counter added successfully:', addPatientResponse.data);
        }
        nav("/evaluation");
    };

    const handlePredict = async () => {
        if (isPredict) return;
        setIsPredict(true);
        setShowResults(false);

        try {
            const responseBinary = await predictImageBinary(lastPatient);
            setBinaryPredictions((prevState) => 
                prevState.map(prediction => ({
                    ...prediction,
                    probability: responseBinary.data.Confidence, 
                    disease: responseBinary.data['Predicted Label'], 
                    binary_id: responseBinary.data['Binary ID']
                }))
            );

            const responseMulticlass = await predictImageMulticlass(lastPatient);
            setMulticlassPredictions((prevState) => 
                prevState.map(prediction => ({
                    ...prediction,
                    probability: responseMulticlass.data.Confidence, 
                    disease: responseMulticlass.data['Predicted Label'], 
                    multiclass_id: responseMulticlass.data['Multiclass ID']
                }))
            );

            setBinaryId(responseBinary.data['Binary ID']);
            setMulticlassId(responseMulticlass.data['Multiclass ID']);
            setShowResults(true);

        } catch (error) {
            console.error("Error predicting:", error);
            alert("Failed to predict.");
        } finally {
            setIsPredict(false); // Reset after predictions are done
        }
    };

    const handleCheckboxChange = (index, value, type) => {
        const updatePredictions = type === 'binary' ? binaryPredictions : multiclassPredictions;
        const setPredictions = type === 'binary' ? setBinaryPredictions : setMulticlassPredictions;
        const idField = type === 'binary' ? 'binary_id' : 'multiclass_id';
    
        // Ensure index is within bounds
        if (index < 0 || index >= updatePredictions.length) return;
    
        const updatedPredictions = updatePredictions.map((prediction, i) =>
            i === index ? { ...prediction, sesuai_tidaksesuai: value } : prediction
        );
        setPredictions(updatedPredictions);
    
        // Extract id safely and initialize pending changes if undefined
        const id = updatePredictions[index]?.[idField];
        if (id) {
            setPendingChanges(prev => ({
                ...prev,
                [type]: [...(prev[type] || []), { id, sesuai_tidaksesuai: value }]
            }));
        }
    };
    
    const handleCommentChange = (index, newComment, type) => {
        const updatePredictions = type === 'binary' ? binaryPredictions : multiclassPredictions;
        const setPredictions = type === 'binary' ? setBinaryPredictions : setMulticlassPredictions;
        const idField = type === 'binary' ? 'binary_id' : 'multiclass_id';
    
        // Ensure index is within bounds
        if (index < 0 || index >= updatePredictions.length) return;
    
        const updatedPredictions = updatePredictions.map((prediction, i) =>
            i === index ? { ...prediction, comment: newComment } : prediction
        );
        setPredictions(updatedPredictions);
    
        // Extract id and existing sesuai_tidaksesuai value safely
        const id = updatePredictions[index]?.[idField];
        const sesuai_tidaksesuai = updatePredictions[index]?.sesuai_tidaksesuai;
        if (id) {
            setPendingChanges(prev => ({
                ...prev,
                [type]: [
                    ...(prev[type] || []),
                    { id, comment: newComment, sesuai_tidaksesuai }
                ]
            }));
        }
    };    

    return (
        <>
            <div className="bg-tertiary min-h-screen relative overflow-y-auto">
                <Navbar />
                <div className="pl-64 w-screen min-h-screen pb-20 pt-10 pr-20">
                    <UploadImage 
                        images={images}    
                        patientCount={patientCount}
                        maxImages={maxImages}
                        previewImage={previewImage}
                        handleImageClick={handleImageClick}
                        handleImageDelete={handleImageDelete}
                        handleImageUpload={handleImageUpload}
                    />
                    <div className="flex justify-center">
                        {/* <Button
                            radius="lg"
                            size="lg"
                            className="bg-transparent border border-2 border-white px-5 py-8 text-white font-bold text-2xl mt-10"
                            type="button"
                        >
                            Save Session
                        </Button> */}
                        <Button
                            radius="lg"
                            size="lg"
                            className="bg-blueish px-12 py-8 text-white font-bold text-2xl mt-10"
                            type="button"
                            onClick={handlePredict}
                        >
                            Predict
                        </Button>
                    </div>

                    {isPredict && (
                        <div className="flex justify-center mt-10 flex-col gap-10 items-center">
                            <div className="w-32 h-32 border-4 border-blueish border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-white text-2xl ml-5">Processing prediction, please wait...</p>
                        </div>
                    )}

                    {showResults && (
                        <>
                            <PredictionResults
                                predictions={binaryPredictions}
                                handleCheckboxChange={handleCheckboxChange}
                                handleCommentChange={handleCommentChange}
                                type="binary"
                            />
                            <PredictionResults
                                predictions={multiclassPredictions}
                                handleCheckboxChange={handleCheckboxChange}
                                handleCommentChange={handleCommentChange}
                                type="multiclass"
                            />
                            <Button
                                radius="lg"
                                size="lg"
                                className="bg-primary px-5 py-8 text-white font-bold text-2xl mt-20"
                                type="button"
                                onClick={handleNextPatient}
                            >
                                Next Patient
                            </Button>
                            {patientCount > 30 && (
                                <Button
                                    radius="lg"
                                    size="lg"
                                    className="bg-blueish ml-20 px-12 py-8 text-white font-bold text-2xl"
                                    type="button"
                                    onClick={handleDone}
                                >
                                    Done
                                </Button>
                            )}
                        </>
                    )}

                    
                </div>
            </div>
            <CompletionModal 
                isOpen={isOpen} 
                onOpen={onOpen} 
                handleContinue={handleContinue} 
                handleDone={handleDone} 
            />
        </>
    );
}

export default Prediction;
