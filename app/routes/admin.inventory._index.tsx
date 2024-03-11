/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  useLoaderData,
  useActionData,
  useNavigate,
  Form,
} from "@remix-run/react";
import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";
import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Image,
} from "@nextui-org/react";
import { DeleteIcon } from "~/assets/icons/DeleteIcon";
import { EditIcon } from "~/assets/icons/EditIcon";
import { EyeOutlined } from "~/assets/icons/EyeOutlined";
import { columns } from "~/data";
import { useAsyncList } from "@react-stately/data";

export default function Inventory() {
  const { admins, page, totalPages, search_term } = useLoaderData();
  console.log(admins, page, totalPages);

  const navigate = useNavigate();

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

  // table data:: useAsync logic, loading states
  const [studentData, setStudentData] = useState(students);

  useEffect(() => {
    setStudentData(students);
  }, [students]);

  const [isLoading, setIsLoading] = useState(true);
  const list = useAsyncList({
    async load() {
      setIsLoading(false);

      return {
        items: studentData,
      };
    },
    async sort({ items, sortDescriptor }: { items: any; sortDescriptor: any }) {
      return {
        items: items.sort((a: any, b: any) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });
  useEffect(() => {
    list.reload();
  }, [studentData]);
  // end table data:: useAsync logic, loading states

  // table top content
  const tableTopContent = (
    <div className="flex items-center justify-between">
      <div className="w-1/3 rounded-xl flex items-center gap-2">
        <Form method="get" className="flex items-center justify-center gap-2">
          <Input
            className="rounded-xl"
            classNames={{
              inputWrapper: "!h-10",
            }}
            name="search_term"
            radius="lg"
            defaultValue={search_term}
            size="sm"
          />
          <Button
            className="h-10 font-montserrat"
            color="primary"
            variant="flat"
            type="submit"
          >
            Search
          </Button>
        </Form>
      </div>
      <Button
        className="font-montserrat"
        size="md"
        color="primary"
        startContent={<PlusIcon />}
        onPress={openCreateRecordModal}
      >
        <Input className="hidden" name="intent" value={"create"} />
        Register Student
      </Button>
    </div>
  );
  // end table top content

  return (
    <AdminLayout>
      {/* <CustomTable
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
      /> */}
      {/* <CustomTable
          items={studentData}
          totalPages={totalPages}
          columns={columns}
          addButtonText="Register Student"
          createRecordFormItems={registerStudentFormItems}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        /> */}
      {tableTopContent}
      <Table
        aria-label="Students Table"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        isHeaderSticky
        classNames={{
          wrapper: "dark:!bg-slate-900/80 bg-white/80",
        }}
        bottomContent={
          totalPages > 1 ? (
            <div className="flex w-full items-center">
              <Pagination
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={(page) => {
                  let baseUrl = location.pathname + location.search;
                  const regex = /([?&]page=)\d+/g;

                  if (
                    baseUrl.includes("?page=") ||
                    baseUrl.includes("&page=")
                  ) {
                    baseUrl = baseUrl.replace(regex, `$1${page}`);
                  } else {
                    baseUrl += baseUrl.includes("?")
                      ? `&page=${page}`
                      : `?page=${page}`;
                  }

                  navigate(baseUrl);
                }}
              />
            </div>
          ) : null
        }
      >
        <TableHeader className="!bg-blue-500">
          {columns.map((column) => (
            <TableColumn
              className="font-montserrat bg-slate-700 dark:bg-slate-900 text-white"
              key={column.key}
              allowsSorting
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          // items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={
            isLoading ? (
              <></>
            ) : (
              <div className="flex items-center justify-center flex-col gap-3">
                <img src={emptyFolderSVG} alt="No data" />
                <p className="font-nunito text-lg md:text-xl">
                  No records found
                </p>
              </div>
            )
          }
        >
          {list.items.map((student: any, index) => (
            <TableRow key={index}>
              <TableCell className="!w-16">
                {student.profileImage === "" ? (
                  // show intials
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <p className="font-nunito text-sm text-white">
                      {student.firstName.charAt(0).toUpperCase()}
                      {student.lastName.charAt(0).toUpperCase()}
                    </p>
                  </div>
                ) : (
                  <Image
                    isZoomed
                    src={student.profileImage}
                    alt="profile image"
                    radius="full"
                    classNames={{
                      img: "size-10",
                    }}
                  />
                )}
              </TableCell>
              <TableCell className="font-nunito text-sm">
                {student.firstName}
              </TableCell>
              <TableCell className="font-nunito text-sm">
                {student.lastName}
              </TableCell>
              <TableCell className="font-nunito text-sm">
                {student.gender}
              </TableCell>
              <TableCell className="font-nunito text-sm">
                {student.class.name}
              </TableCell>
              <TableCell>
                <Chip
                  variant="flat"
                  classNames={{
                    content: "font-nunito text-xs",
                  }}
                  size="sm"
                  color={student.status === "active" ? "success" : "danger"}
                >
                  {student.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="relative flex items-center">
                  <Tooltip content="Details">
                    <Button
                      variant="light"
                      radius="full"
                      color="default"
                      isIconOnly
                      size="sm"
                      onPress={() => {
                        navigate(`/admin/students/${student._id}`);
                      }}
                    >
                      <EyeOutlined className="size-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Edit user">
                    <Button
                      variant="light"
                      radius="full"
                      color="primary"
                      isIconOnly
                      size="sm"
                      onClick={() => openEditRecordModal(student)}
                    >
                      <EditIcon className="size-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <Button
                      onClick={() => openDeleteModal(student._id)}
                      variant="light"
                      radius="full"
                      color="danger"
                      isIconOnly
                      size="sm"
                    >
                      <DeleteIcon className="size-4" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
  console.log(search_term);

  const { admins, totalPages } = await adminControlle.getAdmins({
    page,
    search_term,
    // status: status ? status : "pending",
    // from,
    // to,
  });

  console.log({ page, totalPages });

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
