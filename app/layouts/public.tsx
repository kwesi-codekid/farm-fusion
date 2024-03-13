import { NavLink } from "@remix-run/react";
import { ReactNode } from "react";
import AppLogo from "~/components/includes/AppLogo";

const PublicLayout = ({ children }: { children: ReactNode | string }) => {
  return (
    <>
      <header>
        <nav className="flex items-center justify-center py-2 max-w-7xl mx-auto">
          <AppLogo hasBackground={false} />
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <NavLink to="/login" className="btn btn-primary">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-secondary">
              Register
            </NavLink>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
};
export default PublicLayout;
