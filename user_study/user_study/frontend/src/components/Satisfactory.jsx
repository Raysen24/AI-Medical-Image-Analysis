import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import correct from "../assets/correct.svg";
import { useEffect, useState } from "react";
import axios from "axios"
import { URL } from "../../api/APIconst"

function Satisfactory() {
    const nav = useNavigate();
    const [score, setScore] = useState("0/10");

    useEffect(() => {
        // Retrieve score from local storage
        const storedScore = localStorage.getItem('pretestScore');
        if (storedScore) {
            setScore(`${storedScore}/10`);
        }
    }, []);

    const handleNext = async () => {
        try {
            const token = localStorage.getItem('token');

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            const response = await axios.get(URL+"/logbooks/get/1").catch((e) => console.error(e))
            console.log(response.data);
            if (response.statusText != "OK") throw new Error(`Response status: ${response.status}`);

            const last_patient = response.data[0].last_patient;
            const patient_count = response.data[0].patient_count + 1;
            const logbook_id = response.data[0].logbook_id;

            console.log("Last Patient:", last_patient);
            console.log("Patient Count:", patient_count);
            console.log("Logbook ID:", logbook_id);
            if (last_patient && patient_count && logbook_id) {
                nav(`/prediction`, { state: { last_patient, patient_count, logbook_id } });
            } else {
                console.warn("No last_patient found for logbook:", logbook_id);
            }         
        } catch (error) {
            console.error("Error fetching last patient for logbook:", error);
        }
    }

    return (
        <>
            <div className="bg-tertiary h-screen relative">
                <div className="absolute h-full bg-secondary w-48">
                </div>
                <div className="pl-64 w-screen h-screen pt-28 pr-20 flex items-center justify-center">
                    <div 
                        className="bg-senary w-3/4 h-full rounded-t-3xl px-40 py-28 flex flex-col items-center"
                        style={{
                            backgroundImage: `url(${correct})`,
                            backgroundSize: 'auto',  // Adjust as needed (e.g., 'contain' or specific dimensions)
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <div className="mb-16">
                            <p className="font-bold text-5xl">Pre-Test Results</p>
                        </div>
                        <div className="">
                            <p className="font-bold text-5xl text-greenish">Satisfactory</p>
                        </div>
                        <div className="my-16">
                            <p className="font-medium text-5xl">{score}</p>
                        </div>
                        <div className="mb-16">
                            <p className="font-medium text-4xl leading-normal">You passed the pre-test results. Click “continue” to proceed</p>
                        </div>
                        <Button
                            radius="lg"
                            size="lg"
                            className="px-16 py-7 bg-blueish text-white font-bold text-xl"
                            type="button"
                            onClick={handleNext}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Satisfactory;
