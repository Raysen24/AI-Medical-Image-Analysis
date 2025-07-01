import {Button, Input} from "@nextui-org/react";
import cross from "../assets/cross.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Unsatisfactory() {
    const nav = useNavigate();
    const [score, setScore] = useState("0/10");

    useEffect(() => {
        // Retrieve score from local storage
        const storedScore = localStorage.getItem('pretestScore');
        if (storedScore) {
            setScore(`${storedScore}/10`);
        }
    }, []);

    const handleNext = () => {
        nav("/pretest");
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
                            backgroundImage: `url(${cross})`,
                            backgroundSize: 'auto',  // Adjust as needed (e.g., 'contain' or specific dimensions)
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        
                        <div className="mb-16">
                            <p className="font-bold text-5xl">Pre-Test Results</p>
                        </div>
                        <div className="">
                            <p className="font-bold text-5xl text-reddish">Unsatisfactory</p>
                        </div>
                        <div className="my-16">
                            <p className="font-medium text-5xl">{score}</p>
                        </div>
                        <div className="mb-16">
                            <p className="font-medium text-4xl leading-normal">Unfortunately, you will not be continuing on the next step.</p>
                        </div>
                        <Button
                            radius="lg"
                            size="lg"
                            className="px-16 py-7 bg-blueish text-white font-bold text-xl"
                            type="button"
                            onClick={handleNext}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Unsatisfactory;