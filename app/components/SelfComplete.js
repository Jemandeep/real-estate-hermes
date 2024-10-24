// components/SelfComplete.js
import React from 'react';

export const handleSelfComplete = (formValues, setFormValues) => {
  const currentPrice = parseFloat(formValues.current_price);

  if (!currentPrice || isNaN(currentPrice)) {
    alert('Please enter a valid current market price first.');
    return;
  }

  // Favorable assumptions for profitability
  const interestRate = 3.5; // Assuming a 3.5% interest rate
  const loanTermYears = 30; // Assuming a 30-year loan
  const mortgageAmount = currentPrice * 0.75; // Assume 75% of the price is mortgaged (favor lower mortgage for profit)
  const monthlyPayment = (mortgageAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + (interestRate / 100 / 12), -loanTermYears * 12));

  // Random factor with skew towards profit
  const randomFactor = (min, max) => Math.random() * (max - min) + min;

  // Skewed chance of a property being profitable (80% chance of profit)
  const favorProfit = Math.random() < 0.8;

  // If we favor profit, expenses will be on the lower end of the range
  const maintenanceFactor = favorProfit ? randomFactor(0.005, 0.01) : randomFactor(0.01, 0.02);
  const taxesFactor = favorProfit ? randomFactor(0.0075, 0.0125) : randomFactor(0.0125, 0.02);
  const insuranceFactor = favorProfit ? randomFactor(0.002, 0.005) : randomFactor(0.005, 0.007);

  setFormValues({
    ...formValues,
    purchased_price: currentPrice * randomFactor(0.9, 0.95), // Purchased price closer to current price
    past_6_months_prices: Array(6).fill().map(() => currentPrice * randomFactor(0.95, 1)), // Assume prices were stable or slightly decreasing in last 6 months
    past_5_year_price: currentPrice * randomFactor(0.65, 0.75), // Price 5 years ago (65%-75% of current)
    past_10_year_price: currentPrice * randomFactor(0.45, 0.55), // Price 10 years ago (45%-55% of current)
    past_15_year_price: currentPrice * randomFactor(0.25, 0.35), // Price 15 years ago (25%-35% of current)
    mortgage_monthly_payment: monthlyPayment.toFixed(2),
    mortgage_amount: mortgageAmount.toFixed(2),
    mortgage_interest_rate: interestRate,
    loan_term_years: loanTermYears,
    equity: (currentPrice - mortgageAmount).toFixed(2), // Equity is the difference between current price and mortgage amount
    down_payment: (currentPrice * 0.25).toFixed(2), // Assume higher down payment for favorable equity (25%)
    maintenance: (currentPrice * maintenanceFactor).toFixed(2), // Skew maintenance towards lower range
    taxes: (currentPrice * taxesFactor).toFixed(2), // Skew taxes towards lower range
    insurance: (currentPrice * insuranceFactor).toFixed(2), // Skew insurance towards lower range
  });
};

const SelfCompleteButton = ({ formValues, setFormValues }) => {
  return (
    <button
      type="button"
      onClick={() => handleSelfComplete(formValues, setFormValues)}
      className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
    >
      Self Complete Based on Market Price
    </button>
  );
};

export default SelfCompleteButton;
