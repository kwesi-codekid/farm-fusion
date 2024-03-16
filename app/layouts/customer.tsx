/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ReactNode, useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "@remix-run/react";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import {
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";

// import data
import { customerNavLinks } from "~/data/nav-links";

const AppLogo = () => {
  return (
    <div className={`flex items-center rounded-xl justify-center`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-8 text-blue-600"
      >
        <path d="M6 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6ZM15.75 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3H18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-2.25ZM6 12.75a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3v-2.25a3 3 0 0 0-3-3H6ZM17.625 13.5a.75.75 0 0 0-1.5 0v2.625H13.5a.75.75 0 0 0 0 1.5h2.625v2.625a.75.75 0 0 0 1.5 0v-2.625h2.625a.75.75 0 0 0 0-1.5h-2.625V13.5Z" />
      </svg>
      <div>
        <h1 className="text-sm font-extrabold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 hidden lg:block">
          FarmFusion
        </h1>
      </div>
    </div>
  );
};

const CustomerLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const mobileNavRef = useRef(null);
  const handleOutsideNavClick = (e: any) => {
    if (!mobileNavRef.current.contains(e.target)) {
      setMenuVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideNavClick, true);
  }, []);
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <main className="p-2 h-screen flex gap-4 bg-blue-50 dark:bg-slate-950">
      <aside className="hidden lg:flex h-full lg:w-[17%] rounded-xl bg-blue-600 dark:bg-slate-900 flex-col justify-between py-4">
        <div></div>
        <nav className="flex flex-col gap-2 px-3">
          {customerNavLinks.map((navItem, index) => (
            <NavLink
              className={`${
                navItem.href === pathname
                  ? "bg-blue-500/50 dark:bg-slate-950/30"
                  : ""
              } font-quicksand text-white rounded-lg py-2 flex items-center gap-2 hover:bg-blue-500/50 hover:dark:bg-slate-950/30 transition-all duration-300`}
              key={index}
              to={navItem.href}
            >
              {navItem.href === pathname ? (
                <span className="w-1 h-full bg-white rounded-r-lg"></span>
              ) : (
                <span className="w-1"></span>
              )}
              {navItem.icon && navItem.icon}
              {navItem.name}
            </NavLink>
          ))}
        </nav>
        <div></div>
      </aside>

      <section className="h-full lg:flex-1 flex flex-col gap-4 w-full">
        <header className="h-12 lg:h-14 flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl px-3 lg:px-5">
          <div className="flex items-center gap-1 md:gap-3">
            <div className="block lg:hidden">
              <AppLogo />
            </div>
            <h3 className="font-montserrat font-medium text-xl lg:text-3xl">
              {
                customerNavLinks.find((navItem) => pathname === navItem.href)
                  ?.title
              }
            </h3>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-row-reverse">
            <button
              type="button"
              onClick={() => setMenuVisible(true)}
              className="lg:hidden outline-none border-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-8 text-slate-800 dark:text-white"
                fill="currentColor"
              >
                <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
              </svg>
            </button>

            {/* user avatar dropdown */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                    size: "sm",
                    classNames: {
                      base: "!size-6",
                    },
                  }}
                  className="transition-transform"
                  classNames={{
                    name: "hidden md:flex",
                    description: "hidden md:flex",
                  }}
                  description="Admin"
                  name="Tony Reichert"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">@tonyreichert</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* themeswitcher */}
            <ThemeSwitcher />
          </div>

          {/* mobile retractable sidebar */}
          <motion.aside
            ref={mobileNavRef}
            initial="hide"
            animate={menuVisible ? "show" : "hide"}
            variants={{
              hide: {
                x: "-100%",
                transition: {
                  all: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                },
              },
              show: {
                x: 0,
                transition: {
                  all: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                },
              },
            }}
            className="fixed top-0 left-0 bg-white dark:backdrop-blur-lg dark:bg-slate-900/30 h-full w-[90%] md:w-[30%] shadow-2xl border-r dark:border-slate-100/20 z-50"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p>Menu</p>

              <button
                className="font-montserrat outline-none text-white text-2xl"
                onClick={() => setMenuVisible(false)}
              >
                X
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {customerNavLinks.map((navItem, index) => (
                <NavLink to={navItem.href} key={index}>
                  {navItem.name}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </header>

        <section className="flex-1 overflow-y-hidden">{children}</section>
      </section>
    </main>
  );
};

export default CustomerLayout;
