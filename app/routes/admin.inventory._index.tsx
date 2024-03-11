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
import CustomSelect from "~/components/custom/CustomSelect";
import { useEffect, useState } from "react";
import InventoryController from "~/controllers/InventoryController";

export default function Inventory() {
  const { admins, page, totalPages, search_term } = useLoaderData();
  console.log(admins, page, totalPages);

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

  const [editItem, setEditItem] = useState({});

  const createAdminFormItems = (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <CustomInput
        isRequired={true}
        label="First Name"
        name="firstName"
        isInvalid={actionData?.errors?.firstName ? true : false}
        errorMessage={actionData?.errors?.firstName}
      />
      <CustomInput
        label="Last Name"
        name="lastName"
        isInvalid={actionData?.errors?.lastName ? true : false}
        errorMessage={actionData?.errors?.lastName}
      />
      <CustomInput
        label="Email"
        name="email"
        type="email"
        isInvalid={actionData?.errors?.email ? true : false}
        errorMessage={actionData?.errors?.email}
      />
      <CustomInput
        label="Phone"
        name="phone"
        isInvalid={actionData?.errors?.phone ? true : false}
        errorMessage={actionData?.errors?.phone}
      />
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
        isInvalid={actionData?.errors?.confirmPassword ? true : false}
        errorMessage={actionData?.errors?.confirmPassword}
      />
      <CustomSelect
        label="Role"
        name="role"
        isInvalid={actionData?.errors?.role ? true : false}
        errorMessage={actionData?.errors?.role}
        items={[
          {
            value: "admin",
            label: "Admin",
            id: "admin",
            chipColor: "primary",
          },
          {
            value: "super admin",
            label: "Super Admin",
            id: "super-admin",
            chipColor: "secondary",
          },
        ]}
      />
    </div>
  );

  const editAdminFormItems = (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <input type="text" name="_id" value={editItem?._id} className="hidden" />
      <CustomInput
        isRequired={true}
        label="First Name"
        name="firstName"
        isInvalid={actionData?.errors?.firstName ? true : false}
        errorMessage={actionData?.errors?.firstName}
        defaultValue={editItem?.firstName}
      />
      <CustomInput
        label="Last Name"
        name="lastName"
        isInvalid={actionData?.errors?.lastName ? true : false}
        errorMessage={actionData?.errors?.lastName}
        defaultValue={editItem?.lastName}
      />
      <CustomInput
        label="Email"
        name="email"
        type="email"
        isInvalid={actionData?.errors?.email ? true : false}
        errorMessage={actionData?.errors?.email}
        defaultValue={editItem?.email}
      />
      <CustomInput
        label="Phone"
        name="phone"
        isInvalid={actionData?.errors?.phone ? true : false}
        errorMessage={actionData?.errors?.phone}
        defaultValue={editItem?.phone}
      />
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
        isInvalid={actionData?.errors?.confirmPassword ? true : false}
        errorMessage={actionData?.errors?.confirmPassword}
      />
      <CustomSelect
        label="Role"
        name="role"
        isInvalid={actionData?.errors?.role ? true : false}
        errorMessage={actionData?.errors?.role}
        defaultKey={editItem.role}
        items={[
          {
            value: "admin",
            label: "Admin",
            id: "admin",
            chipColor: "primary",
          },
          {
            value: "super admin",
            label: "Super Admin",
            id: "super-admin",
            chipColor: "secondary",
          },
        ]}
      />
    </div>
  );

  return (
    <AdminLayout>
      <CustomTable
        editRecord={editItem}
        setEditRecord={setEditItem}
        createRecordFormItems={createAdminFormItems}
        editRecordFormItems={editAdminFormItems}
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
        currentPage={page}
        totalPages={totalPages}
        searchTerm={search_term}
      />
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname + url.search;

  const formData = await request.formData();
  const intent = formData.get("intent");

  const _id = formData.get("_id") as string;
  const stockDate = formData.get("stockDate") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const quantity = formData.get("quantity") as string;
  const location = formData.get("location") as string;
  const availability = formData.get("availability") as string;

  const inventoryController = await new InventoryController(request);

  switch (intent) {
    case "create": {
      const errors = {
        // password: passwordMatch(password),
        // confirmPassword: confirmPassword(
        //   password,
        //   formData.get("confirmPassword") as string
        // ),
        // email: validateEmail(email),
        // phone: phone ? null : "Phone is required",
        // role: role ? null : "Role is required",
        // designation: role ? null : "Designation is required",
        // firstName: validateFirstName(firstName),
        // lastName: validateLastName(lastName),
      };

      if (Object.values(errors).some(Boolean)) {
        return json({ errors }, { status: 400 });
      }

      return await inventoryController.createInventory({
        path,
        stockDate,
        code,
        description,
        quantity,
        location,
        availability,
      });
    }
    case "update": {
      return await inventoryController.updateInventory({
        path,
        _id,
        stockDate,
        code,
        description,
        quantity,
        location,
        availability,
      });
    }
    case "delete": {
      return await inventoryController.deleteInventory({
        path,
        _id,
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

      return await inventoryController.resetPassword({
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
  console.log(search_term);

  const inventoryController = await new InventoryController(request);

  const { inventories, totalPages } = await inventoryController.getInventories({
    page,
    search_term,
    // status: status ? status : "pending",
    // from,
    // to,
  });

  return { inventories, page, totalPages, user, search_term, roles };
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
