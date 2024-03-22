import {
  getMonthlyLoan,
  getMonthlyPayment,
  monthlyToYearly,
  round,
  separate,
  toMonthlyRate,
} from "../util/loan";

type LoanTablePageProps =
  | {
      rate: number;
      term: number;
      breakdown: "yearly" | "monthly";
    } & (
      | {
          propertyValue: number;
          downPayment: number;
        }
      | {
          loanAmount: number;
        }
    );

export const LoanTablePage = (props: LoanTablePageProps) => {
  let loanAmount;
  if ("loanAmount" in props) {
    loanAmount = props.loanAmount;
  } else {
    loanAmount = props.propertyValue * (1 - props.downPayment / 100);
  }
  const monthlyPayment = getMonthlyPayment(loanAmount, props.rate, props.term);
  const rawTerms = [
    ...getMonthlyLoan({
      monthlyRate: toMonthlyRate(props.rate),
      term: props.term,
      loanAmount,
      monthlyPayment,
    }),
  ];

  const terms =
    props.breakdown === "monthly" ? rawTerms : monthlyToYearly(rawTerms);

  return (
    <div className="mt-5 mx-5">
      <div className="mb-5 flex items-center justify-center">
        <div className="stats shadow">
          {"propertyValue" in props && (
            <div className="stat">
              <div className="stat-title">Önerő</div>
              <div className="stat-value">
                {separate(round(props.propertyValue - loanAmount, 0))} Ft
              </div>
              <div className="stat-desc">
                {separate(round(loanAmount, 0))} Ft hitelösszeg mellett
              </div>
            </div>
          )}

          <div className="stat">
            <div className="stat-title">Törlesztőrészlet</div>
            <div className="stat-value">
              {separate(round(monthlyPayment, 0))} Ft
            </div>
            <div className="stat-desc">
              legalább {separate(round(monthlyPayment * 2, 0))} Ft havi nettó
              bevétel esetén igényelhető
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Teljes visszafizetett összeg</div>
            <div className="stat-value">
              {separate(round(monthlyPayment * props.term, 0))} Ft
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

      <table className="table table-sm table-pin-rows table-zebra-zebra shadow">
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
    </div>
  );
};
