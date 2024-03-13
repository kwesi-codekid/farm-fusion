/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from "~/layouts/adminLayout";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tooltip,
  useDisclosure,
  Button,
  Input,
  Pagination,
  Chip,
} from "@nextui-org/react";
import AdminController from "~/controllers/AdminController";
import CustomerController from "~/controllers/CustomerController";

// icons
import { EyeOutlined } from "~/assets/icons/EyeOutlined";
import { EditIcon } from "~/assets/icons/EditIcon";
import { DeleteIcon } from "~/assets/icons/DeleteIcon";
import { PlusIcon } from "~/assets/icons/PlusIcon";

// modals
import CreateRecordModal from "~/components/custom/CreateRecordModal";
import EditRecordModal from "~/components/custom/EditRecordModal";
import ConfirmModal from "~/components/custom/ConfirmModal";

import CustomDatePicker from "~/components/custom/CustomDatepicker";
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";
import { useEffect, useState } from "react";
import InventoryController from "~/controllers/InventoryController";
import { useAsyncList } from "@react-stately/data";

import { customerColumns } from "~/data/table-columns";
import emptyFolderSVG from "~/assets/svgs/empty_folder.svg";

export default function AdminCustomers() {
  const { customers, search_term, page, totalPages } = useLoaderData<any>();
  const [customersData, setCustomersData] = useState(customers);
  useEffect(() => {
    setCustomersData(customers);
  }, [customers]);
  console.log(customers);

  // begin:: action data
  const actionData = useActionData();
  useEffect(() => {
    if (actionData) {
      console.log(actionData);
    }
  }, [actionData]);
  // end:: action data

  const navigate = useNavigate();

  // delete record stuff
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState<string>("");
  const openDeleteModal = (deleteId: string) => {
    setDeleteId(deleteId);
    deleteDisclosure.onOpen();
  };

  // create record stuff
  const createRecordDisclosure = useDisclosure();
  const openCreateRecordModal = () => {
    createRecordDisclosure.onOpen();
  };

  // edit record stuff
  const editRecordDisclosure = useDisclosure();
  const [editRecord, setEditRecord] = useState<any>({});
  const openEditRecordModal = (record: any) => {
    setEditRecord(record);
    editRecordDisclosure.onOpen();
  };

  // table data:: useAsync logic, loading states
  const [isLoading, setIsLoading] = useState(true);
  const list = useAsyncList({
    async load() {
      setIsLoading(false);

      return {
        items: customersData,
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
  }, [customersData]);

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
    </div>
  );
  // end table top content

  return (
    <AdminLayout>
      <section className="p-4 flex flex-col gap-4">
        {tableTopContent}
        <Table
          aria-label="Customers Table"
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
            {customerColumns.map((column) => (
              <TableColumn
                className="font-montserrat bg-slate-700 dark:bg-slate-900 text-white"
                key={column.key}
                allowsSorting
              >
                {column.title}
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
            {list.items.map((customer: any, index) => (
              <TableRow key={index}>
                <TableCell className="font-nunito text-sm">
                  {customer.fullName}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {customer.email}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {customer.phone}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {customer.address}
                </TableCell>
                {/* <TableCell className="font-nunito text-sm">
                  <Chip
                    variant="flat"
                    classNames={{
                      content: "font-nunito text-xs",
                    }}
                    size="sm"
                    color={
                      customer.availability === "in-stock"
                        ? "success"
                        : "danger"
                    }
                  >
                    {customer.availability}
                  </Chip>
                </TableCell> */}
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
                          navigate(`/admin/customers/${customer._id}`);
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
                        onClick={() => openEditRecordModal(customer)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                      <Button
                        onClick={() => openDeleteModal(customer._id)}
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
      </section>

      {/* create modal */}
      <CreateRecordModal
        title="Create Record"
        isModalOpen={createRecordDisclosure.isOpen}
        onCloseModal={createRecordDisclosure.onClose}
        size={"md"}
      >
        ce
        {/* {createStockFormItems} */}
      </CreateRecordModal>

      {/* edit modal */}
      <EditRecordModal
        record={editRecord}
        title="Edit Record"
        isModalOpen={editRecordDisclosure.isOpen}
        onCloseModal={editRecordDisclosure.onClose}
      >
        {/* {editStockFormItems} */}
        <p>Edit Items</p>
      </EditRecordModal>

      {/* delete modal */}
      <ConfirmModal
        title="Delete Record"
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
        formMethod="POST"
        formAction=""
      >
        <Input className="hidden" name="intent" value={"delete"} />
        <Input className="hidden" name="_id" value={deleteId} />
        <p className="font-nunito">
          Are you sure you want to delete this stock?
        </p>
      </ConfirmModal>
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
