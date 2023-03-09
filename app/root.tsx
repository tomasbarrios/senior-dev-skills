import React from "react";
import { useChangeLanguage } from "./fixes/i18next";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
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

async function getLocale(request: Request) {
  let locale = await i18next.getLocale(request);
  return locale
}

export async function loader({ request }: LoaderArgs) {
  // throw new Error("HEY MEN, this sould be tetse")
  return json({
    user: await getUser(request),
    locale: await getLocale(request),
  });
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

function Document({ locale = 'es', title = "This is great, all ok", children }: {locale?: string, title?: string, children: React.ReactNode}) {

  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
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
  let { locale } = useLoaderData<typeof loader>();

  return (
    <Document locale={locale}>
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
