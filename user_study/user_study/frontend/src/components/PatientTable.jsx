import React, { useState, useEffect } from "react";
import {Pagination} from "@nextui-org/react";
import axios from "axios";
import {URL} from "../../api/APIconst";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

function PatientTable() {
    const [patients, setPatients] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const totalPages = Math.ceil(patients.length / PAGE_SIZE);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const selectedPatients = patients.slice(startIndex, startIndex + PAGE_SIZE);

    useEffect(() => {
        const fetchPatients = async () => {
            if (isLoading) return;
            setIsLoading(true);

            const token = localStorage.getItem('token');
            
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            const response = await axios.get(URL+"/predict/patients/data/"+currentPage).catch((e) => console.error(e))
            console.log(response)
            if (response.statusText != "OK") throw new Error(`Response status: ${response.status}`);

            const content = response.data;
            content.map((e) => {
                e.patientID = e.patient_id;
                e.binary = e.binary_confidence_rate + "% " + e.binary_result;
                e.multiclass = e.multiclass_confidence_rate + "% " + e.multiclass_result;

                const date = new Date(e.updated_datetime);
                date.setHours(date.getHours() + 7);
                e.lastUpdated = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }) + ', ' + date.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
            });
            
            console.log(content);
            setPatients(content); 
            
            setIsLoading(false);
        }
        
        fetchPatients()
    }, [currentPage])

    const handleRowClick = (patientID) => {
        // Navigate to PatientProfile with the patientID
        console.log(patientID);
        navigate(`/patientprofile/${patientID}`);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-fixed bg-transparent text-2xl border">
                <thead className="bg-denary text-senary">
                    <tr className="text-center">
                        <th className="py-7 px-10">Patient ID</th>
                        <th className="py-7 px-10">Binary</th>
                        <th className="py-7 px-10">Multiclass</th>
                        <th className="py-7 px-10">Last Updated</th>
                        <th className="py-7 px-10">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedPatients.map((patient, index) => (
                        <tr key={index} className="border-t border-nonary text-center" onClick={() => handleRowClick(patient.patientID)}>
                            <td className="py-7 px-10">{patient.patientID}</td>
                            <td className="py-7 px-10">{patient.binary}</td>
                            <td className="py-7 px-10">{patient.multiclass}</td>
                            <td className="py-7 px-10">{patient.lastUpdated}</td>
                            <td className="py-7 px-10">
                                <a href="#" className="text-white font-bold">&gt;</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isLoading && (
                <div className="flex justify-center mt-10 flex-col gap-10 items-center">
                    <div className="w-32 h-32 border-4 border-blueish border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-2xl ml-5">Processing patient history, please wait...</p>
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
        </div>
    );
}

export default PatientTable;
