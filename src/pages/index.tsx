import { Layout } from "./layout";
import { LoanAmountPage } from "./loan-amount";
import { LoanTablePage } from "./loan-table";

export const DEFAULT_LOAN_AMOUNT = 32_000_000;
export const DEFAULT_RATE = 4.5;
export const DEFAULT_TERM = 20 * 12;

export const IndexPage = ({
  loanAmount = DEFAULT_LOAN_AMOUNT,
  rate = DEFAULT_RATE,
  term = DEFAULT_TERM,
}) => {
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
                    hx-include="[name='loanAmount'],[name='propertyValue'],[name='downPayment']"
                  />
                  <span>Ingatlan értéke</span>
                </label>
              </div>
            </div>
            <div id="loan-amount" className="stat-value">
              <LoanAmountPage
                showPropertyValue={false}
                loanAmount={loanAmount}
              />
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
        <LoanTablePage rate={rate} loanAmount={loanAmount} term={term} />
      </div>
    </Layout>
  );
};
