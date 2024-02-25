import AdminLayout from "~/layouts/adminLayout";
import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";

export default function Admins() {
  return (
    <AdminLayout>
      <CustomTable
        formItems={
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4">
              <CustomInput label="First Name" name="firstName" />
              <CustomInput label="Last Name" name="lastName" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput label="Phone" name="phone" />
              <CustomInput label="Email" name="email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput label="Password" name="password" />
              <CustomInput label="Confirm Password" name="confirm" />
            </div>
          </div>
        }
      />
    </AdminLayout>
  );
}
