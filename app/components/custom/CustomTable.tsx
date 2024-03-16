/* eslint-disable @typescript-eslint/no-explicit-any */

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

// icons
import { EyeOutlined } from "~/assets/icons/EyeOutlined";
import { EditIcon } from "~/assets/icons/EditIcon";
import { DeleteIcon } from "~/assets/icons/DeleteIcon";
import { PlusIcon } from "~/assets/icons/PlusIcon";

// modals
import CreateRecordModal from "~/components/custom/CreateRecordModal";
import EditRecordModal from "~/components/custom/EditRecordModal";
import ConfirmModal from "~/components/custom/ConfirmModal";

import { ReactNode, useEffect, useState } from "react";
import { useAsyncList } from "@react-stately/data";

import emptyFolderSVG from "~/assets/svgs/empty_folder.svg";

export default function CustomTable({
  createRecordFormItems,
  editRecordFormItems,
  tableColumns,
  data,
  page,
  totalPages = 1,
  search_term,
}: {
  createRecordFormItems: ReactNode;
  editRecordFormItems: ReactNode;
  tableColumns: any[];
  data: any[];
  page?: number;
  totalPages?: number;
  search_term?: string;
}) {
  // begin:: loader data

  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data, tableData]);
  // end:: loader data

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
        items: tableData,
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
  }, [tableColumns]);
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
        New Stock
      </Button>
    </div>
  );
  // end table top content

  return (
    <div>
      <section className="p-4 flex flex-col gap-4">
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
            {tableColumns.map((column) => (
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
            {list.items.map((inventory: any, index) => (
              <TableRow key={index}>
                <TableCell className="font-nunito text-sm">
                  {new Date(inventory.stockDate)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {inventory.quantity}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {inventory.description}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {inventory.location}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  <Chip
                    variant="flat"
                    classNames={{
                      content: "font-nunito text-xs",
                    }}
                    size="sm"
                    color={
                      inventory.availability === "in-stock"
                        ? "success"
                        : "danger"
                    }
                  >
                    {inventory.availability}
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
                          navigate(`/admin/inventory/${inventory._id}`);
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
                        onClick={() => openEditRecordModal(inventory)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                      <Button
                        onClick={() => openDeleteModal(inventory._id)}
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
        {createRecordFormItems}
      </CreateRecordModal>

      {/* edit modal */}
      <EditRecordModal
        record={editRecord}
        title="Edit Record"
        isModalOpen={editRecordDisclosure.isOpen}
        onCloseModal={editRecordDisclosure.onClose}
      >
        {editRecordFormItems}
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
    </div>
  );
}
