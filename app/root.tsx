import { type LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Outlet, useCatch } from '@remix-run/react';

import globalStylesUrl from './styles/global.css';
import globalMediumStylesUrl from './styles/global-medium.css';
import globalLargeStylesUrl from './styles/global-large.css';
import { type ReactNode } from 'react';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: globalStylesUrl,
    },
    {
      rel: 'stylesheet',
      href: globalMediumStylesUrl,
      media: 'print, (min-width: 640px)',
    },
    {
      rel: 'stylesheet',
      href: globalLargeStylesUrl,
      media: 'screen and (min-width: 1024px)',
    },
  ];
};

function DocumentRoot({ children, title = `Remix: So great, it's funny!` }: { children: ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <DocumentRoot>
      <Outlet />
    </DocumentRoot>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <DocumentRoot title="Ooops!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </DocumentRoot>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <DocumentRoot title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </DocumentRoot>
  );
}
