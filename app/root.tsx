import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import radixStyles from "~/radix.css";
import Providers from "./providers";
import { useEffect, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { getSession } from "./flash-session";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: radixStyles },
];

export default function App() {
  const { flashMessage } = useLoaderData<{
    flashMessage: { title: string; description?: string; status: string };
  }>();

  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [openSuccessToast, setOpenSuccessToast] = useState(false);

  useEffect(() => {
    if (flashMessage) {
      console.log(flashMessage);
      if (flashMessage.status == "success") {
        setOpenSuccessToast(true);

        console.log("call success toast");
      } else {
        setOpenErrorToast(true);
        console.log("call error toast");
      }
    }
  }, [flashMessage]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>
          <Toast.Provider swipeDirection="down">
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />

            {/* error toaster */}
            <Toast.Root
              className="ToastRoot flex flex-col"
              open={openErrorToast}
              onOpenChange={setOpenErrorToast}
            >
              <Toast.Title className="text-red-500 font-montserrat font-bold text-sm">
                Error!
              </Toast.Title>
              <Toast.Description asChild>
                <p className="font-nunito !text-slate-700 text-xs ToastDescription">
                  {flashMessage && flashMessage.title}
                </p>
              </Toast.Description>
              <Toast.Action className="ToastAction" asChild altText="Close">
                <button className="Button small green hidden">Undo</button>
              </Toast.Action>
            </Toast.Root>

            {/* success */}
            <Toast.Root
              className="ToastRoot flex flex-col"
              open={openSuccessToast}
              onOpenChange={setOpenSuccessToast}
            >
              <Toast.Title className="text-red-500 font-montserrat font-bold text-sm">
                Error!
              </Toast.Title>
              <Toast.Description asChild>
                <p className="font-nunito !text-slate-700 text-xs ToastDescription">
                  {flashMessage && flashMessage.title}
                </p>
              </Toast.Description>
              <Toast.Action className="ToastAction" asChild altText="Close">
                <button className="Button small green hidden">Undo</button>
              </Toast.Action>
            </Toast.Root>
            <Toast.Viewport className="ToastViewport" />
          </Toast.Provider>
        </Providers>
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getFlashSession(request.headers.get("Cookie"));
  const flashMessage = session.get("message") || null;

  return json(
    { flashMessage },
    {
      headers: {
        // only necessary with cookieSessionStorage
        "Set-Cookie": await commitFlashSession(session),
      },
    }
  );
};
