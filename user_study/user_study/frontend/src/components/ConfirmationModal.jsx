import {Modal, ModalContent, ModalHeader, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import thirty from "../assets/30.svg";

function ConfirmationModal({isOpen, onOpen, handleContinue, handleCancel}) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpen} size={"4xl"} className="py-8 px-20 bg-senary">
            <ModalContent className="flex">
                <ModalHeader 
                    className="text-5xl text-white text-center leading-snug h-96 flex items-center mt-5"
                    style={{
                        backgroundImage: `url(${thirty})`,
                        backgroundSize: 'auto',  // Adjust as needed (e.g., 'contain' or specific dimensions)
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    This logbook has already exceeded its quota. Do you still want to continue? 
                </ModalHeader>
                <ModalFooter className="flex justify-center gap-10 mt-5">
                    <Button
                        radius="lg"
                        size="lg"
                        className="bg-primary px-5 py-8 text-white font-bold text-2xl"
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        radius="lg"
                        size="lg"
                        className="bg-blueish px-12 py-8 text-white font-bold text-2xl"
                        type="button"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmationModal;