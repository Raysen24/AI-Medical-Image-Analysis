import complete from '../assets/complete.svg';
import { URL } from "../../api/APIconst"
import {Pagination} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

const PAGE_SIZE = 5;
const PATIENT_COUNT = 30;

function LogbookContent() {
    const [logbook, setLogbook] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activeLogbookId, setActiveLogbookId] = useState(null);

    const totalPages = Math.ceil(logbook.length / PAGE_SIZE);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const selectedLogbook = logbook.slice(startIndex, startIndex + PAGE_SIZE);

    useEffect(() => {
        const fetchLogbook = async () => {
            if (isLoading) return;
            setIsLoading(true);

            const token = localStorage.getItem('token');
            
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            const response = await axios.get(URL+"/logbooks/get/"+currentPage).catch((e) => console.error(e))
            console.log(response)
            if (response.statusText != "OK") throw new Error(`Response status: ${response.status}`);

            const content = response.data;
            content.map((e) => {
                e.date = new Date(e.date).toLocaleDateString();
                e.progress = e.patient_count + "/" + PATIENT_COUNT;
                e.complete = e.completed;
                delete e.completed;
            });
            
            console.log(content);
            setLogbook(content);
            setIsLoading(false);
        }
        
        fetchLogbook()
    }, [])

    // Handle logbook click to navigate to the prediction page
    const handleLogbookClick = async (logbookId) => {
        try {
            const token = localStorage.getItem('token');
            
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            const response = await axios.get(`${URL}/logbooks/get/id/${logbookId}`);

            console.log(response.data);
            const last_patient = response.data.last_patient;
            const patient_count = response.data.patient_count + 1;
            const logbook_id = response.data.logbook_id;

            console.log("Last Patient:", last_patient);
            console.log("Patient Count:", patient_count);
            console.log("Logbook ID:", logbook_id);
            if (last_patient && patient_count && logbook_id) {
                navigate(`/prediction`, { state: { last_patient, patient_count, logbook_id } });
            } else {
                console.warn("No last_patient found for logbook:", logbook_id);
            }            
        } catch (error) {
            console.error("Error fetching last patient for logbook:", error);
        }
    };

    const handleOpenModal = (logbookId) => {
        setActiveLogbookId(logbookId); // Set the active logbook ID
        onOpen(); // Open the modal
    };

    const handleCancel = () => {
        setActiveLogbookId(null); // Reset active logbook ID
        onClose(); // Close the modal
    };

    const handleContinue = () => {
        if (activeLogbookId) {
            handleLogbookClick(activeLogbookId); // Pass the active logbook ID
            setActiveLogbookId(null); // Reset active logbook ID
            onClose(); // Close the modal
        }
    };

    return (
        <>
            <div className="flex flex-col gap-6 w-full">
                {selectedLogbook.map((entry, index) => (
                    <>
                        <div 
                            key={index} 
                            className={`bg-quinary py-8 pl-7 pr-12 rounded-2xl 'cursor-pointer'`}
                            onClick={() => entry.complete ? handleOpenModal(entry.logbook_id) : handleLogbookClick(entry.logbook_id)} // Only clickable if not complete
                        >
                            <div className="flex items-center">
                                <div className="mr-8">
                                    <p className="text-2xl font-bold">{entry.date}</p>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <p className="text-2xl font-light">{entry.progress}</p>
                                    {entry.patient_count > 30 && (
                                        <div className="ml-7 text-2xl font-semibold text-reddish">
                                            Quota Exceeded
                                        </div>
                                    )}
                                </div>

                                
                                <div className="w-7">
                                    {entry.complete ? <img src={complete} className='w-7' alt="complete" /> : <p className="text-2xl font-bold">&gt;</p>}
                                </div>
                            </div>
                            <ConfirmationModal 
                                isOpen={isOpen && activeLogbookId === entry.logbook_id} 
                                onOpen={onOpen} 
                                handleContinue={() => handleContinue(entry.logbook_id)} 
                                handleCancel={handleCancel} 
                            />
                        </div>
                        
                    </>
                ))}
            </div>

            {isLoading && (
                <div className="flex justify-center mt-10 flex-col gap-10 items-center">
                    <div className="w-32 h-32 border-4 border-blueish border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-2xl ml-5">Processing logbook, please wait...</p>
                </div>
            )}

            <div className="flex justify-center items-center mt-10 w-full">
                <Pagination 
                    color="nonary" 
                    // showControls 
                    page={currentPage}
                    total={totalPages}
                    onChange={(currentPage) => setCurrentPage(currentPage)}
                    classNames={{
                        wrapper: "gap-4 overflow-visible rounded border border-divider",
                        item: "bg-septenary text-white text-xl h-10 w-10",
                        cursor:
                        "bg-quinary shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold  text-xl h-10 w-10",
                    }}
                />
            </div>

            
        </>
    )
}

export default LogbookContent;