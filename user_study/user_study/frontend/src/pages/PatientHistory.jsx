import Navbar from "../components/Navbar";
import PatientTable from "../components/PatientTable";

function PatientHistory() {
    return (
        <>
            <div className="bg-tertiary min-h-screen relative overflow-y-auto">
                <Navbar />
                <div className="pl-64 w-screen min-h-screen pb-20 pt-10 pr-20">
                    <div className="text-left w-full">
                        <div className="my-5 flex justify-between items-center">
                            <div>
                                <p className="text-5xl font-bold">Patient's History</p>
                            </div>
                        </div>
                        <div className="mt-16">
                            <PatientTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PatientHistory;