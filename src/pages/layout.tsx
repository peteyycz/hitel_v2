import { raw } from "hono/html";
import type { Child, FC } from "hono/jsx";

type LayoutProps = {
  title?: string;
  children: Child;
};

const isProd = process.env.NODE_ENV === "production";

const manifestPath = "../../dist/.vite/manifest.json";
const getClientAssets = async () => {
  const clientFile = (await import(manifestPath)).default["src/client.tsx"];
  return {
    css: clientFile?.css?.at(0),
    js: clientFile?.file,
  };
};

const { css: cssFile, js: jsFile } = isProd
  ? await getClientAssets()
  : { css: null, js: null };

export const Layout: FC<LayoutProps> = ({ children, title }) => {
  return (
    <html lang="en">
      {cssFile ? raw(`<link rel="stylesheet" href="${cssFile}">`) : null}
      {jsFile ? raw(`<script src="${jsFile}"></script>`) : null}

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title && <title>{title}</title>}
      </head>
      <body className="m-5">
        {children}
        {isProd
          ? null
          : raw(`<script
                type="module"
                src="http://localhost:5173/@vite/client"
            ></script>
            <script
                type="module"
                src="http://localhost:5173/src/client.tsx"
            ></script>`)}
      </body>
    </html>
  );
};
