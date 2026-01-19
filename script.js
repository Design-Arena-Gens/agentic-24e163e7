const form = document.getElementById("loan-form");
const summary = document.getElementById("summary");
const monthlyPaymentEl = document.getElementById("monthly-payment");
const totalPaidEl = document.getElementById("total-paid");
const totalInterestEl = document.getElementById("total-interest");
const tableBody = document.querySelector("#amortization-table tbody");

const formatCurrency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);

const clearTable = () => {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
};

const buildRow = (cells) => {
  const row = document.createElement("tr");
  cells.forEach((cellValue) => {
    const cell = document.createElement("td");
    cell.textContent = cellValue;
    row.appendChild(cell);
  });
  return row;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const principal = Number(form.amount.value);
  const annualRate = Number(form.rate.value);
  const totalTerms = Number(form.terms.value);

  if (!principal || !annualRate || !totalTerms) {
    summary.classList.add("hidden");
    clearTable();
    return;
  }

  const monthlyRate = annualRate / 12 / 100;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / totalTerms
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalTerms));

  let remainingBalance = principal;
  let totalInterest = 0;

  clearTable();

  for (let term = 1; term <= totalTerms; term += 1) {
    const interestPayment = monthlyRate === 0 ? 0 : remainingBalance * monthlyRate;
    const capitalPayment = monthlyPayment - interestPayment;
    remainingBalance = Math.max(0, remainingBalance - capitalPayment);
    totalInterest += interestPayment;

    tableBody.appendChild(
      buildRow([
        term,
        formatCurrency(monthlyPayment),
        formatCurrency(interestPayment),
        formatCurrency(capitalPayment),
        formatCurrency(remainingBalance),
      ]),
    );
  }

  monthlyPaymentEl.textContent = formatCurrency(monthlyPayment);
  totalInterestEl.textContent = formatCurrency(totalInterest);
  totalPaidEl.textContent = formatCurrency(monthlyPayment * totalTerms);
  summary.classList.remove("hidden");
});
