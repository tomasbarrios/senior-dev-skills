import React from "react";
import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  // throw new Error("HEY MEN, this sould be tetse")
  return json({
    user: await getUser(request),
  });
}

function bomb() {
  throw new Error("OHHHHH MY GOSH")
}
function Document({ title = "This is great, all ok", children }: {title?: string, children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      <head> 
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="h-full">
        <ScrollRestoration />
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
      <LiveReload />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Oh no">
      <div className="error-boundary">
        <h1>Something went wront</h1>
        <p>Lets us know if your are having issues</p>
        <p>Details ${error.message}</p>
      </div>
    </Document>
  );
}
