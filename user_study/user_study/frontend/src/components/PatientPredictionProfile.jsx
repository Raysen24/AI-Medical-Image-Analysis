function PatientPredictionProfile({ prediction }) {
    return (
        <div className="mt-10 w-full">
            {/* {predictions.map((prediction, index) => ( */}
                {/* <div key={index} className="mb-10"> */}
                    <div className="flex justify-around items-end">
                        <div className="text-4xl font-bold text-blueish flex-1 text-left">
                            <p>{prediction.confidence_rate}% {prediction.result}</p>
                        </div>
                    </div>
                    <div className="mt-10 w-full h-48 rounded-lg bg-senary px-5 py-4">
                        <p
                            className="w-full h-full bg-transparent text-white text-2xl text-left resize-none outline-none"
                        >
                            {prediction.comment || "Tidak ada komen"}
                        </p>
                    </div>
                {/* </div> */}
            {/* ))} */}
        </div>
    );
}

export default PatientPredictionProfile;