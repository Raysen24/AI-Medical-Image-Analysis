import EvaluationForm from "../components/EvaluationForm";
import Navbar from "../components/Navbar";

function Evaluation() {
    return (
        <>
            <div className="bg-tertiary min-h-screen relative overflow-y-auto">
                <Navbar />
                <div className="pl-64 w-screen min-h-screen py-20 pr-20">
                    <EvaluationForm />
                </div>
            </div>
        </>
    )
}

export default Evaluation;