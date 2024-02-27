import { LoaderFunction } from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
import AdminLayout from "~/layouts/adminLayout";

export default function AdminIndex() {
  return (
    <AdminLayout>
      <div></div>
    </AdminLayout>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  // const url = new URL(request.url);

  const adminControlle = await new AdminController(request);
  const user = await adminControlle.getAdmin();
  console.log({ user });

  return {
    user,
  };
};
