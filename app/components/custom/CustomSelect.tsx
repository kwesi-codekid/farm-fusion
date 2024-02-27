import { Select, SelectItem, Chip } from "@nextui-org/react";

const CustomSelect = ({
  label,
  name,
  items,
  isInvalid,
  errorMessage,
  isRequired,
}: {
  label: string;
  name: string;
  items: {
    value: string;
    label: string;
    id: string | number;
    chipColor: "primary" | "secondary" | "success" | "warning" | "danger";
  }[];
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
}) => {
  return (
    <Select
      items={items}
      label={label}
      className="max-w-xs"
      name={name}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      required={isRequired}
    >
      {(item) => (
        <SelectItem key={item.value} value={item.value} textValue={item.label}>
          <Chip color={item.chipColor} variant="flat" className="font-nunito">
            {item.label}
          </Chip>
        </SelectItem>
      )}
    </Select>
  );
};

export default CustomSelect;
