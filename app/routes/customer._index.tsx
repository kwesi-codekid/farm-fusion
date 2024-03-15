import CustomerLayout from "~/layouts/customer";

const CustomerDashboard = () => {
  return (
    <CustomerLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 h-full">
        {/* left side cards */}
        <div className="md:col-span-2 flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md-gap-5">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-violet-800"></div>
            {/* overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-5">
              <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
              <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
              <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
              <div className="rounded-xl px-3 py-2 h-16 bg-white dark:bg-slate-900"></div>
            </div>
          </div>
          <div className="rounded-xl px-3 py-2 bg-white dark:bg-slate-900 flex-1"></div>
        </div>

        {/* right side cards */}
        <div className="grid grid-cols-1 gap-4 md:gap-5 ">
          <div className="rounded-xl px-3 py-2 bg-white dark:bg-slate-900"></div>
          <div className="rounded-xl px-3 py-2 bg-white dark:bg-slate-900"></div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
