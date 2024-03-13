import React from "react";
import AppLogo from "~/components/includes/AppLogo";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import avatar from "~/assets/imgs/avatar.png";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { NavLink, useLocation } from "@remix-run/react";
import ConfirmModal from "~/components/custom/ConfirmModal";
import NavLinks from "~/components/custom/NavLink";
import { navLinks } from "~/data/nav-links";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="min-h-screen md:h-screen overflow-hidden flex flex-col md:flex-row bg-blue-500/10 dark:bg-slate-950 p-2 gap-2">
      {/* sidebar */}
      <div className="hidden md:flex flex-col justify-between py-3 px-3 h-full w-[17%] bg-white dark:bg-slate-900 rounded-2xl">
        <AppLogo />

        {/* nav links */}
        <aside>
          {/* desktop sidebar content */}
          <nav className="hidden md:block">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => {
                return (
                  <div key={index}>
                    {link.children.length > 0 ? (
                      <Accordion
                        defaultExpandedKeys={[pathname]}
                        motionProps={{
                          variants: {
                            enter: {
                              y: 0,
                              opacity: 1,
                              height: "auto",
                              transition: {
                                height: {
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                  duration: 1,
                                },
                                opacity: {
                                  easings: "ease",
                                  duration: 1,
                                },
                              },
                            },
                            exit: {
                              y: -10,
                              opacity: 0,
                              height: 0,
                              transition: {
                                height: {
                                  easings: "ease",
                                  duration: 0.25,
                                },
                                opacity: {
                                  easings: "ease",
                                  duration: 0.3,
                                },
                              },
                            },
                          },
                        }}
                        key={index}
                        className="w-full"
                      >
                        <AccordionItem
                          key={link.path}
                          title={link.name}
                          startContent={link.icon}
                        >
                          {link.children.map((child, index) => (
                            <NavLink
                              key={index}
                              to={child.path}
                              className="flex items-center gap-2 p-3 font-montserrat text-sm text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30"
                            >
                              {child.icon ? child.icon : ""}
                              <span>{child.name}</span>
                            </NavLink>
                          ))}
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <NavLink
                        key={index}
                        to={link.path}
                        className={`flex items-center gap-2 p-3 py-2 font-quicksand font-medium text-sm text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30 rounded-lg ${
                          pathname === link.path
                            ? " dark:bg-slate-950 !text-lightgreen bg-green-400/5 pl-0"
                            : ""
                        }`}
                      >
                        {pathname === link.path && (
                          <span className="w-1 h-7 bg-violet-500 rounded-r-md"></span>
                        )}
                        {link.icon ? link.icon : ""}
                        <span
                          className={` ${
                            pathname === link.path ? "text-lightgreen" : ""
                          }`}
                        >
                          {link.name}
                        </span>
                      </NavLink>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </aside>

        <div className="flex items-center justify-between px-3  rounded-xl pt-4">
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
      <div className="h-full flex-1 flex flex-col gap-2">
        {/* header */}
        <div className="flex items-center px-3 justify-between bg-white dark:bg-slate-900 rounded-xl h-12">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold dark:text-slate-100 text-slate-600  font-montserrat">
              {navLinks.find((link) => link.path === pathname)?.title ||
                "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
          </div>
        </div>
        <div
          className={`px-3 py-3 flex-1 bg-white dark:bg-slate-900 overflow-y-auto rounded-xl`}
        >
          {children}
        </div>
      </div>

      {/* logout modal */}
      <ConfirmModal
        formMethod="POST"
        isModalOpen={isOpen}
        onCloseModal={onClose}
        title="Logout"
        formAction="/admin/logout"
      >
        <p className="font-nunito">Are you sure you want to logout?</p>
      </ConfirmModal>
    </div>
  );
};

export default AdminLayout;
