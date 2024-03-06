import {
  getMonthlyLoan,
  getMonthlyPayment,
  round,
  separate,
  toMonthlyRate,
} from "../util/loan";
import { Layout } from "./layout";

export const DEFAULT_LOAN_AMOUNT = 32_960_000;
export const DEFAULT_RATE = 4.5;
export const DEFAULT_TERM = 20 * 12;

export const IndexPage = ({
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
    <Layout title="Homepage">
      <p>{separate(round(loanAmount, 0))} Ft</p>
      <p>{separate(round(monthlyPayment, 0))} Ft</p>
      <p>{rate} %</p>
      <table className="m-5 shadow bg-white rounded-md border p-5">
        <thead className="shadow">
          <tr>
            <td className="p-3 text-xl">Hónap</td>
            <td className="p-3 text-xl">Tartozás</td>
            <td className="p-3 text-xl">Tőketartozás csökkenés</td>
            <td className="p-3 text-xl">Kamat</td>
          </tr>
        </thead>
        <tbody className="divide-y">
          {terms.map(({ loanAmount, capitalDebtDecrease, interest }, i) => {
            return (
              <tr>
                <td className="text-right px-2 py-1">{i + 1}.</td>
                <td className="text-right px-2 py-1">
                  {separate(round(loanAmount, 0))} Ft
                </td>
                <td className="text-right px-2 py-1">
                  {separate(round(capitalDebtDecrease, 0))} Ft
                </td>
                <td className="text-right px-2 py-1">
                  {separate(round(interest, 0))} Ft
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
};
