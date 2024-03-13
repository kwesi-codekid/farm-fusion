import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import AdminController from "~/controllers/AdminController";
import CustomerController from "~/controllers/CustomerController";

export default function AdminCustomers() {
  const { customers } = useLoaderData();
  console.log(customers);

  return <div>AdminCustomers</div>;
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

  const customerController = await new InventoryController(request);

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

      return await customerController.createInventory({
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
      return await customerController.updateInventory({
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
      return await customerController.deleteInventory({
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

      return await customerController.resetPassword({
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

  const adminControlle = await new AdminController(request);
  const user = await adminControlle.getAdmin();

  const customerController = await new CustomerController(request);

  const { customers, totalPages } = await customerController.getCustomers({
    page,
    search_term,
  });

  return { customers, page, totalPages, user, search_term };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Admins - Customers | Rewards" },
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
