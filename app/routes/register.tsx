import { Input, Button } from "@nextui-org/react";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import PublicLayout from "~/layouts/public";

import analyticSVG from "~/assets/svgs/analytics.svg";
import { EyeFilledIcon } from "~/assets/icons/EyeFilled";
import { EyeSlashFilledIcon } from "~/assets/icons/EyeSlashFilled";
import AdminController from "~/controllers/AdminController";
import {
  confirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "~/validators";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import CustomerController from "~/controllers/CustomerController";

const Register = () => {
  const actionData = useActionData();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <PublicLayout>
      <div className="h-screen md:h-full md:overflow-hidden bg-white dark:bg-slate-950 py-5 px-4">
        {/* login container */}
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto h-full md:items-center gap-5 md:gap-10">
          {/* left side */}
          <div className="md:flex flex-col w-full md:w-1/2 hidden">
            <div className="flex justify-center items-center">
              <img src={analyticSVG} alt="analytics" />
            </div>
          </div>

          {/* right side */}
          <div className="flex flex-col  gap-8 flex-1 pt-6 md:pt-0">
            {/* header */}
            <div className="md:hidden items-start gap-2 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 text-blue-600"
              >
                <path d="M6 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6ZM15.75 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3H18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-2.25ZM6 12.75a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3v-2.25a3 3 0 0 0-3-3H6ZM17.625 13.5a.75.75 0 0 0-1.5 0v2.625H13.5a.75.75 0 0 0 0 1.5h2.625v2.625a.75.75 0 0 0 1.5 0v-2.625h2.625a.75.75 0 0 0 0-1.5h-2.625V13.5Z" />
              </svg>
              <div>
                <h1 className="text-3xl font-extrabold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500">
                  FarmFusion
                </h1>
                <p className="text-xs md:text-sm font-nunito text-slate-600 dark:text-slate-100">
                  Advanced tools for effective management
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-montserrat font-bold text-blue-500 text-sm md:text-base uppercase">
                Register
              </h3>
              <h1 className="font-montserrat font-extrabold text-3xl md:text-4xl lg:text-5xl text-slate-800 dark:text-slate-50">
                Create a Free Account
              </h1>
            </div>
            <Form
              method="POST"
              className="flex flex-col gap-8 w-full md:w-[90%]"
            >
              <div className="flex flex-col gap-6">
                <Input
                  name="fullName"
                  label="Full Name"
                  labelPlacement="inside"
                  className="font-nunito"
                  size="md"
                  isInvalid={actionData?.errors?.fullName ? true : false}
                  errorMessage={actionData?.errors?.fullName}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    name="email"
                    label="Email"
                    labelPlacement="inside"
                    className="font-nunito"
                    size="md"
                    isInvalid={actionData?.errors?.email ? true : false}
                    errorMessage={actionData?.errors?.email}
                  />
                  <Input
                    name="phone"
                    label="Phone Number"
                    labelPlacement="inside"
                    className="font-nunito"
                    size="md"
                    isInvalid={actionData?.errors?.phone ? true : false}
                    errorMessage={actionData?.errors?.phone}
                  />
                </div>
                <Input
                  name="address"
                  label="Address"
                  labelPlacement="inside"
                  className="font-nunito"
                  size="md"
                  isInvalid={actionData?.errors?.address ? true : false}
                  errorMessage={actionData?.errors?.address}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    name="password"
                    label="Password"
                    labelPlacement="inside"
                    fullWidth
                    size="md"
                    className="font-nunito"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    isInvalid={actionData?.errors?.password ? true : false}
                    errorMessage={actionData?.errors?.password}
                  />
                  <Input
                    name="confirmPassword"
                    label="Confirm Password"
                    labelPlacement="inside"
                    fullWidth
                    size="md"
                    className="font-nunito"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    isInvalid={
                      actionData?.errors?.confirmPassword ? true : false
                    }
                    errorMessage={actionData?.errors?.confirmPassword}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  color="primary"
                  className="w-full font-nunito font-bold uppercase"
                  size="lg"
                >
                  Register
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const confirm_password = formData.get("confirmPassword") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;

  const errors = {
    fullName: !validateName(fullName) ? "Invalid name" : null,
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: confirmPassword(password, confirm_password),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors }, { status: 400 });
  }

  const customerController = await new CustomerController(request);
  return await customerController.registerCustomer({
    email,
    password,
    phone,
    address,
    fullName,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const customerController = await new CustomerController(request);
  return (await customerController.getAuthCustomer()) ? redirect("/") : null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Login | FarmFusion" },
    {
      name: "description",
      content: "more plants",
    },
    { name: "og:title", content: "FarmFusion" },
    { property: "og:type", content: "websites" },
    {
      name: "og:description",
      content: "more plants",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1700242905/l843bauo5zpierh3noug.png",
    },
    { name: "og:url", content: "https://single-ecommerce.vercel.app" },
  ];
};
