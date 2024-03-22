export function* getMonthlyLoan({
  loanAmount,
  monthlyRate,
  term,
  monthlyPayment,
}: {
  loanAmount: number;
  monthlyRate: number;
  term: number;
  monthlyPayment: number;
}) {
  let n = term;
  let p = loanAmount;
  while (n > 0) {
    const interest = p * monthlyRate;
    const capitalDebtDecrease = monthlyPayment - interest;

    p -= capitalDebtDecrease;
    n--;

    yield {
      loanAmount: p,
      capitalDebtDecrease,
      interest,
    };
  }
}

type Breakdown = "yearly" | "monthly";

type DebtPeriod = {
  loanAmount: number;
  capitalDebtDecrease: number;
  interest: number;
};

export const monthlyToYearly = (monthly: DebtPeriod[]) => {
  return monthly.reduce((yearly: DebtPeriod[], currentMonth, i) => {
    const year = Math.floor(i / 12);
    const currentYear = yearly[year];
    if (!currentYear) {
      return [...yearly, currentMonth];
    }
    const [head, ...tail] = yearly.reverse();
    return [
      ...tail.reverse(),
      {
        loanAmount: currentMonth.loanAmount,
        capitalDebtDecrease:
          head.capitalDebtDecrease + currentMonth.capitalDebtDecrease,
        interest: head.interest + currentMonth.interest,
      },
    ];
  }, []);
};

export const toMonthlyRate = (yearlyRate: number) => yearlyRate / (100 * 12);

export const getMonthlyPayment = (amount: number, rate: number, term: number) =>
  (amount * Math.pow(1 + toMonthlyRate(rate), term) * toMonthlyRate(rate)) /
  (Math.pow(1 + toMonthlyRate(rate), term) - 1);

export const round = (nr: number, digits = 2) =>
  Math.round(nr * Math.pow(10, digits)) / Math.pow(10, digits);

export const separate = (nr: number) => {
  return nr
    .toString()
    .split("")
    .reverse()
    .reduce(
      (result, current, i) =>
        i % 3 === 0 ? result + " " + current : result + current,
      ""
    )
    .split("")
    .reverse()
    .join("");
};
