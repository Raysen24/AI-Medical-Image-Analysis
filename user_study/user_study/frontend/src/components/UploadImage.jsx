
import { Button } from "@nextui-org/react";
import { RxCross2 } from "react-icons/rx";

function UploadImage({ images, patientCount, maxImages, previewImage, handleImageClick, handleImageDelete, handleImageUpload }) {
    return (
        <div className="text-left w-full">
            <div className="my-5 flex justify-between items-center">
                <div>
                    <p className="text-5xl font-bold">Prediction</p>
                </div>
                <div>
                    <p className="text-4xl font-light">Patient #{patientCount}</p>
                </div>
            </div>
            <div className="mt-12 mb-10 flex justify-between items-center">
                <div className="flex-1">
                    <p className="text-4xl font-medium">Upload Files</p>
                </div>
                <div className="mr-7">
                    <Button
                        radius="lg"
                        size="lg"
                        className="bg-quaternary px-5 py-8 text-white font-bold text-2xl"
                        type="button"
                        onClick={() => document.getElementById('zip-upload').click()}
                        disabled={images.length >= maxImages}
                    >
                        Upload Folder (ZIP)
                    </Button>
                    <input
                        type="file"
                        id="zip-upload"
                        accept=".zip"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>
                <div>
                    <Button
                        radius="lg"
                        size="lg"
                        className="bg-quaternary px-5 py-8 text-white font-bold text-2xl"
                        type="button"
                        onClick={() => document.getElementById('file-upload').click()}
                        disabled={images.length >= maxImages}
                    >
                        Upload Image
                    </Button>
                    <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>
            </div>
            <div className="border-white border-dashed border border-2 px-10 py-10 rounded-lg flex flex-wrap gap-5 justify-around">
                {images.map((image, index) => (
                    <div key={index} className="relative flex flex-col items-center gap-4">
                        <div
                            className="relative bg-white rounded-xl w-72 h-72 cursor-pointer flex items-center justify-center"
                            onClick={() => handleImageClick(image.url)}
                        >
                            <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute inset-0 flex items-start justify-end opacity-0 hover:opacity-100 bg-black bg-opacity-50 rounded-xl pr-2 pt-2">
                                <RxCross2
                                    className="text-red text-4xl"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImageDelete(image.id);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-center w-56">
                            <p className="text-lg">{image.name}</p>
                        </div>
                    </div>
                ))}
            </div>
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => handleImageClick(null)}>
                    <img src={previewImage} alt="Preview" className="max-w-full max-h-full" />
                </div>
            )}
        </div>
    );
}

export default UploadImage;
