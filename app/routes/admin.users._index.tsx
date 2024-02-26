import AdminLayout from "~/layouts/adminLayout";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
import {
  confirmPassword,
  passwordMatch,
  validateEmail,
  validateFirstName,
  validateLastName,
} from "~/validators";
import RoleController from "~/controllers/RoleController";
import { useLoaderData, useActionData } from "@remix-run/react";
import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";
import { useEffect, useState } from "react";

export default function Admins() {
  const { admins } = useLoaderData();
  const actionData = useActionData();
  useEffect(() => {
    if (actionData) {
      console.log(actionData);
    }
  }, [actionData]);

  const [adminsData, setAdminsData] = useState(admins);

  useEffect(() => {
    setAdminsData(admins);
  }, [admins, adminsData]);

  const createAdminFormItems = (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <CustomInput isRequired={true} label="First Name" name="firstName" />
      <CustomInput label="Last Name" name="lastName" />
      <CustomInput label="Email" name="email" />
      <CustomInput label="Phone" name="phone" />
      <CustomInput
        isInvalid={actionData?.errors?.password ? true : false}
        errorMessage={actionData?.errors?.password}
        label="Password"
        name="password"
        type="password"
      />
      <CustomInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
      />
      <CustomInput label="Role" name="role" />
    </div>
  );

  return (
    <AdminLayout>
      <CustomTable
        createRecordFormItems={createAdminFormItems}
        addButtonText="Add User"
        columns={[
          {
            key: "firstName",
            name: "First Name",
          },
          {
            key: "lastName",
            name: "Last Name",
          },
          {
            key: "email",
            name: "Email",
          },
          {
            key: "phone",
            name: "Phone",
          },
          {
            key: "role",
            name: "Role",
          },
          {
            key: "actions",
            name: "Actions",
          },
        ]}
        items={adminsData}
      />
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const _id = formData.get("_id") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const path = formData.get("path") as string;
  const role = formData.get("role") as string;

  const adminController = await new AdminController(request);

  switch (intent) {
    case "create": {
      const errors = {
        password: passwordMatch(password),
        confirmPassword: confirmPassword(
          password,
          formData.get("confirmPassword") as string
        ),
        email: validateEmail(email),
        phone: phone ? null : "Phone is required",
        role: role ? null : "Role is required",
        designation: role ? null : "Designation is required",
        firstName: validateFirstName(firstName),
        lastName: validateLastName(lastName),
      };

      if (Object.values(errors).some(Boolean)) {
        return json({ errors }, { status: 400 });
      }

      return await adminController.createAdmin({
        path,
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });
    }
    case "update": {
      return await adminController.updateAdminProfile({
        path,
        adminId: _id,
        email,
        phone,
        firstName,
        lastName,
        role,
      });
    }
    case "delete": {
      return await adminController.deleteAdmin({
        path,
        adminId: _id,
      });
    }
    case "reset_password": {
      const errors = {
        password: passwordMatch(
          password,
          formData.get("confirmPassword") as string
        ),
      };

      if (Object.values(errors).some(Boolean)) {
        return json({ errors }, { status: 400 });
      }

      return await adminController.resetPassword({
        path,
        adminId: _id,
        password,
      });
    }
    default: {
      throw new Error("Unexpected action");
    }
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const status = url.searchParams.get("order_status") as string;
  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const adminControlle = await new AdminController(request);
  const user = await adminControlle.getAdmin();

  const { admins, totalPages } = await adminControlle.getAdmins({
    page,
    search_term,
    // status: status ? status : "pending",
    // from,
    // to,
  });

  const roleController = new RoleController(request);
  const { roles } = await roleController.getRoles({});

  return { admins, page, totalPages, user, search_term, roles };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Admins - User Management | Rewards" },
    {
      name: "description",
      content: "Rewards easily",
    },
    { name: "og:title", content: "Rewards" },
    {
      name: "og:description",
      content: "Rewards easily",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1701282976/qfdbysyu0wqeugtcq9wq.jpg",
    },
    { name: "og:url", content: "https://www.printmoney.money" },
  ];
};
