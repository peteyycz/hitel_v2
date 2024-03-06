import { Hono } from "hono";

import { IndexPage } from "./pages/index";
import { serveStatic } from "hono/bun";

// Configuration
const port = process.env.PORT || 5050;

const app = new Hono();

app.use("/assets/*", serveStatic({ root: "./dist" }));

const maybeParse = (n?: string): number | undefined =>
  typeof n !== "undefined" ? Number(n) : n;

app.get("/", (c) => {
  const loanAmount = maybeParse(c.req.query("loanAmount"));
  const rate = maybeParse(c.req.query("rate"));
  const term = maybeParse(c.req.query("term"));

  return c.html(<IndexPage rate={rate} term={term} loanAmount={loanAmount} />);
});

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`listening on http://localhost:${port}`);
