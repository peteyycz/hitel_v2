import {
  getMonthlyLoan,
  getMonthlyPayment,
  round,
  separate,
  toMonthlyRate,
} from "../util/loan";

export const DEFAULT_LOAN_AMOUNT = 32_960_000;
export const DEFAULT_RATE = 4.5;
export const DEFAULT_TERM = 20 * 12;

export const LoanTablePage = ({
  loanAmount = DEFAULT_LOAN_AMOUNT,
  rate = DEFAULT_RATE,
  term = DEFAULT_TERM,
}) => {
  const monthlyPayment = getMonthlyPayment(loanAmount, rate, term);
  const terms = [
    ...getMonthlyLoan({
      monthlyRate: toMonthlyRate(rate),
      loanAmount,
      monthlyPayment,
      term,
    }),
  ];

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Törlesztőrészlet</div>
            <div className="stat-value">
              {separate(round(monthlyPayment, 0))} Ft
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Teljes visszafizetett összeg</div>
            <div className="stat-value">
              {separate(round(monthlyPayment * term, 0))} Ft
            </div>
            <div className="stat-desc">
              amelyből kamat{" "}
              {separate(
                round(
                  terms.reduce((prev, { interest }) => {
                    return prev + interest;
                  }, 0),
                  0
                )
              )}{" "}
              Ft
            </div>
          </div>
        </div>
      </div>

      <table className="table table-zebra-zebra shadow">
        <thead>
          <tr>
            <td>Hónap</td>
            <td>Tartozás</td>
            <td>Tőketartozás csökkenés</td>
            <td>Kamat</td>
          </tr>
        </thead>
        <tbody>
          {terms.map(({ loanAmount, capitalDebtDecrease, interest }, i) => {
            return (
              <tr>
                <td className="text-right">{i + 1}.</td>
                <td className="text-right">
                  {separate(round(loanAmount, 0))} Ft
                </td>
                <td className="text-right">
                  {separate(round(capitalDebtDecrease, 0))} Ft
                </td>
                <td className="text-right">
                  {separate(round(interest, 0))} Ft
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
