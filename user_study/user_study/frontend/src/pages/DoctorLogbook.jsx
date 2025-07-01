import LogbookContent from "../components/LogbookContent";
import Navbar from "../components/Navbar";
import React from "react";

function DoctorLogbook() {
    return (
        <>
            <div className="bg-tertiary min-h-screen relative overflow-y-auto">
                <Navbar />
                <div className="pl-64 w-screen min-h-screen pb-20 pt-10 pr-20">
                    <div className="text-left w-full">
                        <div className="my-5 flex justify-between items-center">
                            <div className="flex-1">
                                <p className="text-5xl font-bold">Doctor's Logbook</p>
                            </div>
                        </div>
                        <div className="mt-10">
                            <LogbookContent />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DoctorLogbook;
