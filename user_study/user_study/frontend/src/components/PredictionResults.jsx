function PredictionResults({ predictions, handleCheckboxChange, handleCommentChange, type }) {
    return (
        <div className="mt-10">
            {predictions.map((prediction, index) => (
                <div key={index} className="mb-10">
                    <div className="flex justify-around items-end">
                        <div className="text-4xl font-bold text-blueish flex-1 text-left">
                            <p>{prediction.probability}% {prediction.disease}</p>
                        </div>
                        <div className="mr-10 flex flex-col items-center justify-center gap-3">
                            <label htmlFor={`sesuai-${index}`} className="text-2xl">Sesuai*</label>
                            <input
                                id={`sesuai-${index}`}
                                type="checkbox"
                                name={`sesuai_tidaksesuai-${index}`}
                                checked={prediction.sesuai_tidaksesuai === "sesuai"}
                                onChange={() => handleCheckboxChange(index, "sesuai", type)}
                                className="custom-checkbox-prediction"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <label htmlFor={`tidakSesuai-${index}`} className="text-2xl">Tidak Sesuai*</label>
                            <input
                                id={`tidakSesuai-${index}`}
                                type="checkbox"
                                name={`sesuai_tidaksesuai-${index}`}
                                checked={prediction.sesuai_tidaksesuai === "tidakSesuai"}
                                onChange={() => handleCheckboxChange(index, "tidakSesuai", type)}
                                className="custom-checkbox-prediction"
                            />
                        </div>
                    </div>
                    <div className="mt-10 w-full h-32 rounded-lg bg-nonary px-5 py-4">
                        <textarea
                            className="w-full h-full bg-transparent text-gray-800 text-2xl text-left resize-none outline-none placeholder:text-gray-800"
                            placeholder="Tambah komen"
                            value={prediction.comment}
                            onChange={(e) => handleCommentChange(index, e.target.value, type)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PredictionResults;