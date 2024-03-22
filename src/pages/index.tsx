import {
  DEFAULT_DOWNPAYMENT,
  DEFAULT_LOAN_AMOUNT,
  DEFAULT_PROPERTY_VALUE,
} from "../util/constants";
import { Layout } from "./layout";
import { LoanAmountPage } from "./loan-amount";
import { LoanTablePage } from "./loan-table";

type IndexPageProps = {
  rate: number;
  term: number;
  showPropertyValue?: boolean;
  breakdown: "yearly" | "monthly";
} & (
  | {
      propertyValue?: number;
      downPayment?: number;
    }
  | {
      loanAmount?: number;
    }
);

export const IndexPage = ({
  showPropertyValue,
  rate,
  term,
  ...props
}: IndexPageProps) => {
  return (
    <Layout title="Homepage">
      <form
        className="flex justify-center items-center"
        hx-get="/loan-table"
        hx-target="#results"
        hx-trigger="change delay:500ms"
      >
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">
              <div className="form-control">
                <label className="label cursor-pointer flex items-center justify-between">
                  <span>Hitelösszeg</span>
                  <input
                    hx-get="/loan-amount"
                    hx-target="#loan-amount"
                    type="checkbox"
                    name="showPropertyValue"
                    className="toggle"
                    checked
                    hx-include="[name='loanAmount'],[name='propertyValue'],[name='downPayment']"
                  />
                  <span>Ingatlan értéke</span>
                </label>
              </div>
            </div>
            <div id="loan-amount" className="stat-value">
              {"propertyValue" in props && (
                <LoanAmountPage
                  showPropertyValue={true}
                  propertyValue={props.propertyValue ?? DEFAULT_PROPERTY_VALUE}
                  downPayment={props.downPayment ?? DEFAULT_DOWNPAYMENT}
                />
              )}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Éves kamat</div>
            <div className="stat-value">
              <label className="input flex items-center gap-2" htmlFor="rate">
                <input
                  className="grow"
                  type="number"
                  name="rate"
                  step={0.1}
                  value={rate}
                />
                <span className="badge">%</span>
              </label>
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Futamidő</div>
            <div className="stat-value">
              <label className="input flex items-center gap-2" htmlFor="term">
                <input
                  className="grow"
                  type="number"
                  name="term"
                  step={12}
                  value={term}
                />
                <span className="badge">hónap</span>
              </label>
            </div>
          </div>
        </div>
      </form>

      <div id="results">
        {"propertyValue" in props && (
          <LoanTablePage
            breakdown="monthly"
            rate={rate}
            term={term}
            propertyValue={props.propertyValue ?? DEFAULT_PROPERTY_VALUE}
            downPayment={props.downPayment ?? DEFAULT_DOWNPAYMENT}
          />
        )}
        {"loanAmount" in props && (
          <LoanTablePage
            breakdown="monthly"
            rate={rate}
            term={term}
            loanAmount={props.loanAmount ?? DEFAULT_LOAN_AMOUNT}
          />
        )}
      </div>
    </Layout>
  );
};
