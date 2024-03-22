import { Hono } from "hono";

import { IndexPage } from "./pages/index";
import { serveStatic } from "hono/bun";
import { LoanTablePage } from "./pages/loan-table";
import { LoanAmountPage } from "./pages/loan-amount";
import { DEFAULT_RATE, DEFAULT_TERM } from "./util/constants";

// Configuration
const port = process.env.PORT || 5050;

const app = new Hono();

app.use("/assets/*", serveStatic({ root: "./dist" }));

const maybeParse = (n?: string): number | undefined =>
  typeof n !== "undefined" ? Number(n) : n;

app.get("/", (c) => {
  const showPropertyValue = Boolean(c.req.query("showPropertyValue"));
  const loanAmount = maybeParse(c.req.query("loanAmount"));
  const propertyValue = maybeParse(c.req.query("propertyValue"));
  const downPayment = maybeParse(c.req.query("downPayment"));
  const rate = maybeParse(c.req.query("rate")) ?? DEFAULT_RATE;
  const term = maybeParse(c.req.query("term")) ?? DEFAULT_TERM;

  if (loanAmount) {
    return c.html(
      <IndexPage
        rate={rate}
        term={term}
        showPropertyValue={showPropertyValue}
        loanAmount={loanAmount}
        breakdown="yearly"
      />
    );
  }

  return c.html(
    <IndexPage
      rate={rate}
      term={term}
      showPropertyValue={showPropertyValue}
      propertyValue={propertyValue}
      downPayment={downPayment}
      breakdown="yearly"
    />
  );
});

app.get("loan-table", (c) => {
  const loanAmount = Number(c.req.query("loanAmount"));
  const propertyValue = Number(c.req.query("propertyValue"));
  const downPayment = Number(c.req.query("downPayment"));

  const rate = Number(c.req.query("rate"));
  const term = Number(c.req.query("term"));

  if (loanAmount) {
    return c.html(
      <LoanTablePage
        breakdown="monthly"
        rate={rate}
        term={term}
        loanAmount={loanAmount}
      />
    );
  }

  return c.html(
    <LoanTablePage
      breakdown="monthly"
      rate={rate}
      term={term}
      propertyValue={propertyValue}
      downPayment={downPayment}
    />
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
