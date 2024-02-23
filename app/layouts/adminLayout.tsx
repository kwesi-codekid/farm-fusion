import React from "react";
import AppLogo from "~/components/includes/AppLogo";
import { Avatar, Button, useDisclosure, Input } from "@nextui-org/react";
import avatar from "~/assets/imgs/avatar.png";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { useLocation } from "@remix-run/react";
import ConfirmModal from "~/components/custom/ConfirmModal";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  console.log(pathname);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="min-h-screen md:h-screen bg-slate-400/25 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* sidebar */}
      <div className="hidden md:flex flex-col justify-between py-3 px-3 bg-white dark:bg-slate-900 h-full w-[17%] border-r dark:border-slate-700">
        <AppLogo />

        <div>{/* <PressableCard /> */}</div>

        <div className="flex items-center justify-between px-3 border-t-[1px] dark:border-slate-700 rounded-xl pt-4">
          <div className="flex items-center gap-2">
            <Avatar
              src={avatar}
              className="w-7 h-7"
              isBordered
              color="primary"
            />
            <p className="font-nunito text-sm dark:text-slate-100 text-slate-600">
              Kwesi Codekid
            </p>
          </div>
          <Button
            isIconOnly
            color="danger"
            aria-label="Logout"
            radius="full"
            size="sm"
            onPress={() => {
              onOpen();
              console.log("Logout");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* right side */}
      <div className="h-full flex-1">
        {/* header */}
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center px-3 py-3 bg-white dark:bg-slate-900 border-b-[1px] dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <h1 className="font-nunito text-lg dark:text-slate-100 text-slate-600">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                color="primary"
                size="sm"
                variant="flat"
                className="dark:bg-slate-800"
              >
                Add New
              </Button>
              <Button
                color="primary"
                size="sm"
                variant="solid"
                className="dark:bg-slate-800"
              >
                View All
              </Button>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>

      {/* logout modal */}
      <ConfirmModal
        formMethod="POST"
        isModalOpen={isOpen}
        onCloseModal={onClose}
        title="Logout"
        formAction="/admin/logout"
      >
        <p>Are you sure you want to logout?</p>
      </ConfirmModal>
    </div>
  );
};

export default AdminLayout;
