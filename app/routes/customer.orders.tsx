import CustomerLayout from "~/layouts/customer";

const CustomerOrders = () => {
  return (
    <CustomerLayout>
      <div className="h-full flex flex-col gap-4 lg:gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
          <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
          <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
          <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl"></div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerOrders;
