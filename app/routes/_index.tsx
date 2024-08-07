import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import NextModal from "~/components/next-ui/NextModal";

export default function Index() {
  return (
    <div>
      <ThemeSwitcher />
      <NextModal />
      <h1 className="text-red-500">Welcome to Remix</h1>
    </div>
  );
}
