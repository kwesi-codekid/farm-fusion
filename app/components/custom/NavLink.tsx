/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, NavLink } from "@remix-run/react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";

interface NavLink {
  name: string;
  path: string;
  children: NavLink[];
}

interface NavLinksProps {
  navLinks: NavLink[];
}

const NavLinks: React.FC<NavLinksProps> = ({ navLinks }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <section className="px-2 box-border flex flex-col gap-0.5 w-full">
      {navLinks.map((item, index: any) => (
        <div key={index} className="w-full">
          <NavLink
            end={item.end}
            to={`${item.path}`}
            className={({ isActive }) =>
              isActive
                ? "text-white bg-primary px-2 py-1.5 rounded-xl shadow-sm w-full items-center flex flex-1 transition-all duration-100 ease-in-out"
                : "text-[#656566] px-2 py-1.5 items-center rounded-xl hover:bg-primary/90 w-full flex flex-1 hover:text-gray-50 transition-all duration-100 ease-in-out"
            }
          >
            {item.icon && item.icon}
            <span className="ml-2">{item.name}</span>
          </NavLink>

          <section
            className={`flex flex-col ml-4 mt-1 gap-0.5 transition-all duration-1000 ${
              pathname.includes(item.path) ? "flex" : "hidden"
            }`}
          >
            {item.children?.map((child, idx) => (
              <NavLink
                end={child.end}
                key={idx}
                to={`${child.path}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-white bg-primary px-2 py-1.5 rounded-xl shadow-sm w-full items-center flex flex-1 transition-all duration-100 ease-in-out"
                    : "text-[#656566] px-2 py-1.5 items-center rounded-xl hover:bg-primary/90 w-full flex flex-1 hover:text-gray-50 transition-all duration-100 ease-in-out"
                }
              >
                {child.name}
              </NavLink>
            ))}
          </section>
        </div>
      ))}
    </section>
  );
};

export default NavLinks;
