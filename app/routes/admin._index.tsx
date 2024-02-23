import { LoaderFunction } from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
import AdminLayout from "~/layouts/adminLayout";
import CustomTable from "~/components/custom/CustomTable";

export default function AdminIndex() {
  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      <CustomTable />
    </AdminLayout>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const adminControlle = await new AdminController(request);
  const user = await adminControlle.getAdmin();
  console.log({ user });

  return {
    user,
  };
};
