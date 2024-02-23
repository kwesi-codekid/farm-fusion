import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { useState } from "react";

const ConfirmModal = ({
  isModalOpen,
  onCloseModal,
  title,
  children,
  formMethod,
}: {
  isModalOpen: boolean;
  onCloseModal: () => void;
  title: string;
  children: React.ReactNode;
  formMethod: string;
}) => {
  // state to handle loading
  const [isLoading, setIsLoading] = useState(false);

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const formValues: { [key: string]: string } = {};

      for (const [key, value] of formData.entries()) {
        formValues[key] = value as string;
      }
      //   stimulate a network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(formValues);
      setIsLoading(false);
      onCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      motionProps={{
        variants: {
          enter: {
            y: -20,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: 0,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <Form method="post" id={formMethod} onSubmit={handleSubmit}>
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onCloseModal}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                type="submit"
                form="form"
              >
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
