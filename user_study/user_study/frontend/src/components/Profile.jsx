import PatientPredictionProfile from "./PatientPredictionProfile";

function Profile({patientID, binaryPrediction, multiclassPrediction, images, previewImage, handleImageClick}) {
    return (
        <>
            <div className="text-left w-full">
                <div className="my-5 flex justify-between items-center">
                    <div>
                        <p className="text-5xl font-bold">Patient's Profile</p>
                    </div>
                    <div>
                        <p className="text-4xl font-light"><span className="font-bold">Patient ID:</span> {patientID}</p>
                    </div>
                </div>
                <div className="flex gap-10">
                    <PatientPredictionProfile 
                        prediction={binaryPrediction}
                    />
                    <PatientPredictionProfile 
                        prediction={multiclassPrediction}
                    />
                </div>

                <div className="mt-10 flex flex-col items-center justify-center">
                    
                </div>


                <div className="mt-10 flex flex-col items-center justify-center">
                    <p className="font-bold text-4xl">Images</p>
                    <div className="flex flex-wrap gap-16 justify-around py-10">
                        {images.map((image, index) => (
                            <div key={index} className="flex flex-col items-center gap-4">
                                <div
                                    className="relative bg-white rounded-xl w-72 h-72 cursor-pointer flex items-center justify-center"
                                    onClick={() => handleImageClick(image.url)}
                                >
                                    <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-xl" />
                                </div>
                                <div className="text-center w-56">
                                    <p className="text-lg">{image.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {previewImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => handleImageClick(null)}>
                        <img src={previewImage} alt="Preview" className="max-w-full max-h-full" />
                    </div>
                )}
            </div>
        </>
    )
} 

export default Profile;