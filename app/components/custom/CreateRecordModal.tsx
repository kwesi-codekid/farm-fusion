/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form, useSubmit, useNavigation } from "@remix-run/react";
import { useEffect } from "react";

const CreateRecordModal = ({
  isModalOpen,
  onCloseModal,
  title,
  children,
  actionData,
}: {
  isModalOpen: boolean;
  onCloseModal: () => void;
  title: string;
  children: React.ReactNode;
  actionData?: any;
}) => {
  // state to handle loading
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  useEffect(() => {
    if (!actionData) {
      onCloseModal();
    }
  }, [actionData, onCloseModal]);

  const submit = useSubmit();

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formValues: { [key: string]: string } = {};

      for (const [key, value] of formData.entries()) {
        formValues[key] = value as string;
      }

      submit(
        {
          path: location.pathname + location.search,
          intent: "create",
          ...formValues,
        },
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      className="dark:bg-slate-900 border-[1px] dark:border-slate-700/20 w-full md:w-1/2"
      size="5xl"
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
            <ModalHeader className="flex flex-col gap-1 font-montserrat">
              {title}
            </ModalHeader>
            <ModalBody>
              <Form method={"POST"} id="form" onSubmit={handleSubmit}>
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-montserrat"
                color="danger"
                variant="flat"
                onPress={onCloseModal}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                className="font-montserrat"
                color="primary"
                type="submit"
                form="form"
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateRecordModal;
