import { Hono } from "hono";

import { IndexPage } from "./pages/index";
import { serveStatic } from "hono/bun";
import { LoanTablePage } from "./pages/loan-table";
import { LoanAmountPage } from "./pages/loan-amount";

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

app.get("loan-table", (c) => {
  let loanAmount = maybeParse(c.req.query("loanAmount"));
  if (!loanAmount) {
    const propertyValue = maybeParse(c.req.query("propertyValue"));
    const downPayment = maybeParse(c.req.query("downPayment"));
    loanAmount = propertyValue! * (1 - downPayment! / 100);
  }

  const rate = maybeParse(c.req.query("rate"));
  const term = maybeParse(c.req.query("term"));

  return c.html(
    <LoanTablePage rate={rate} term={term} loanAmount={loanAmount} />
  );
});

app.get("loan-amount", (c) => {
  const showPropertyValue = Boolean(c.req.query("showPropertyValue"));
  let loanAmount = maybeParse(c.req.query("loanAmount"));
  let propertyValue = maybeParse(c.req.query("propertyValue"));
  let downPayment = maybeParse(c.req.query("downPayment"));
  if (loanAmount) {
    propertyValue = loanAmount;
    downPayment = 0;
  }
  if (propertyValue && typeof downPayment === "number") {
    loanAmount = propertyValue * (1 - downPayment / 100);
  }

  if (showPropertyValue) {
    return c.html(
      <LoanAmountPage
        showPropertyValue
        propertyValue={propertyValue!}
        downPayment={downPayment!}
      />
    );
  }
  return c.html(
    <LoanAmountPage
      showPropertyValue={showPropertyValue}
      loanAmount={loanAmount!}
    />
  );
});

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`listening on http://localhost:${port}`);
