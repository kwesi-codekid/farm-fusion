import { Input } from "@nextui-org/react";

const CustomInput = ({
  label,
  name,
  isInvalid,
  errorMessage,
}: {
  label: string;
  name: string;
  type?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}) => {
  return (
    <Input
      classNames={{
        inputWrapper: [
          "dark:bg-slate-800 dark:border-slate-700/20",
          "dark:group-data-[focused=true]:!bg-slate-700",
        ],
        label: "font-nunito font-bold",
        input: ["!font-quicksand", "dark:text-slate-200"],
      }}
      label={label}
      name={name}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
    />
  );
};

export default CustomInput;
