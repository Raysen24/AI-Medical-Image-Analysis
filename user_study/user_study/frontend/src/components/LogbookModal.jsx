import { Modal, ModalContent, ModalHeader, ModalFooter, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

function LogbookModal({ isOpen, onOpen, onClose, handleCancel, handleDone, errorMessage }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCreate = () => {
        handleDone(currentDateTime);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpen} size={"xl"} className="py-8 px-20 bg-senary">
            <ModalContent className="flex flex-col">
                <ModalHeader 
                    className="text-white text-center leading-snug h-56 flex items-center mt-5 justify-center flex-col"
                >
                    <div className="text-4xl">
                        {errorMessage || "Create a Logbook"}
                    </div>
                    {!errorMessage && (
                        <div className="mt-10 text-2xl text-white">
                            Current Date and Time: {currentDateTime.toLocaleString()}
                        </div>
                    )}
                </ModalHeader>
                
                <ModalFooter className="flex justify-center gap-10">
                    <Button
                        radius="lg"
                        size="lg"
                        className="bg-primary px-5 py-8 text-white font-bold text-2xl"
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    {!errorMessage && (
                        <Button
                            radius="lg"
                            size="lg"
                            className="bg-blueish px-12 py-8 text-white font-bold text-2xl"
                            type="button"
                            onClick={handleCreate}
                        >
                            Create
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default LogbookModal;
