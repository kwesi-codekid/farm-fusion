const AppLogo = () => {
  return (
    <div className="flex items-start gap-2 rounded-xl dark:bg-slate-800/50 py-3 justify-center pb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-10 text-blue-600"
      >
        <path d="M6 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6ZM15.75 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3H18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-2.25ZM6 12.75a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3v-2.25a3 3 0 0 0-3-3H6ZM17.625 13.5a.75.75 0 0 0-1.5 0v2.625H13.5a.75.75 0 0 0 0 1.5h2.625v2.625a.75.75 0 0 0 1.5 0v-2.625h2.625a.75.75 0 0 0 0-1.5h-2.625V13.5Z" />
      </svg>
      <div>
        <h1 className="text-2xl font-extrabold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500">
          FarmFusion
        </h1>
        <p className="text-[7px] font-nunito text-slate-600 dark:text-slate-100">
          Advanced tools for effective management
        </p>
      </div>
    </div>
  );
};

export default AppLogo;
