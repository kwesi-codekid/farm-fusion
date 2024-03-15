/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ReactNode, useState, useRef, useEffect } from "react";

const AppLogo = () => {
  return (
    <div className={`flex items-center rounded-xl justify-center`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 text-blue-600"
      >
        <path d="M6 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6ZM15.75 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3H18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-2.25ZM6 12.75a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3v-2.25a3 3 0 0 0-3-3H6ZM17.625 13.5a.75.75 0 0 0-1.5 0v2.625H13.5a.75.75 0 0 0 0 1.5h2.625v2.625a.75.75 0 0 0 1.5 0v-2.625h2.625a.75.75 0 0 0 0-1.5h-2.625V13.5Z" />
      </svg>
      <div>
        <h1 className="text-sm font-extrabold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500">
          FarmFusion
        </h1>
      </div>
    </div>
  );
};

const CustomerLayout = ({ children }: { children: ReactNode }) => {
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
    <main className="p-2 md:h-screen flex gap-4">
      <aside className="hidden lg:flex h-full lg:w-[17%] rounded-xl dark:bg-slate-900"></aside>

      <section className="h-full lg:flex-1 flex flex-col gap-4 w-full">
        <header className="h-12 flex items-center justify-between bg-slate-900 rounded-xl px-3">
          <AppLogo />

          <button
            type="button"
            onClick={() => setMenuVisible(true)}
            className="lg:hidden outline-none border-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-6 text-slate-800 dark:text-white"
              fill="currentColor"
            >
              <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
            </svg>
          </button>

          {/* mobile retractable sidebar */}
          <motion.aside
            ref={mobileNavRef}
            initial="hide"
            animate={menuVisible ? "show" : "hide"}
            variants={{
              hide: {
                x: "-100%",
                opacity: 0.5,
                transition: {
                  all: {
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
              show: {
                x: 0,
                opacity: 1,
                transition: {
                  all: {
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
            }}
            className="fixed top-0 left-0 bg-white dark:backdrop-blur-sm dark:bg-slate-900/30 h-full w-[90%] shadow-2xl border-r dark:border-slate-100/20 z-50"
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
            {/* <nav className="flex flex-col gap-1">
              {navbarLinks.map((link, index) => {
                return (
                  <div key={index}>
                    {link.children.length > 0 ? (
                      <Accordion
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
                          key={index}
                          title={link.label}
                          startContent={link.icon}
                        >
                          {link.children.map((child, index) => (
                            <Link
                              key={index}
                              to={child.href}
                              className="flex items-center gap-2 p-3 font-montserrat text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30"
                            >
                              {child.icon ? child.icon : ""}
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link
                        to={link.href}
                        className={`flex items-center gap-2 p-3 font-montserrat text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/30`}
                      >
                        {link.icon ? link.icon : ""}
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav> */}
          </motion.aside>
        </header>

        <section className="flex-1 overflow-y-hidden dark:bg-slate-900 rounded-xl px-4 py-3">
          {children}
        </section>
      </section>
    </main>
  );
};

export default CustomerLayout;
