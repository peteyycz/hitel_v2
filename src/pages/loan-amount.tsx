type LoanAmountPageProps =
  | {
      showPropertyValue: true;
      propertyValue: number;
      downPayment: number;
    }
  | {
      showPropertyValue: false;
      loanAmount: number;
    };

export const LoanAmountPage = (props: LoanAmountPageProps) => {
  return (
    <>
      {props.showPropertyValue ? (
        <>
          <label
            className="input flex items-center gap-2"
            htmlFor="propertyValue"
          >
            <input
              className="grow"
              type="number"
              name="propertyValue"
              step={100_000}
              value={props.propertyValue}
            />
            <span className="badge">Ft</span>
          </label>
          <label
            className="input flex items-center gap-2"
            htmlFor="downPayment"
          >
            <input
              className="grow"
              type="number"
              name="downPayment"
              value={props.downPayment}
            />
            <span className="badge">%</span>
          </label>
        </>
      ) : (
        <label className="input flex items-center gap-2" htmlFor="loanAmount">
          <input
            className="grow"
            type="number"
            name="loanAmount"
            step={100_000}
            value={props.loanAmount}
          />
          <span className="badge">Ft</span>
        </label>
      )}
    </>
  );
};
