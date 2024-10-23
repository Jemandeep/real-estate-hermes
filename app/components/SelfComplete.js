// components/SelfComplete.js
import React from 'react';

export const handleSelfComplete = (formValues, setFormValues) => {
  const currentPrice = parseFloat(formValues.current_price);

  if (!currentPrice || isNaN(currentPrice)) {
    alert('Please enter a valid current market price first.');
    return;
  }

  // Example calculation logic
  const interestRate = 3.5; // Assuming a 3.5% interest rate
  const loanTermYears = 30; // Assuming a 30-year loan
  const mortgageAmount = currentPrice * 0.8; // Assume 80% of the price is mortgaged
  const monthlyPayment = (mortgageAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + (interestRate / 100 / 12), -loanTermYears * 12));

  setFormValues({
    ...formValues,
    purchased_price: currentPrice * 0.9, // Assuming the purchased price was 10% lower than current price
    past_6_months_prices: Array(6).fill(currentPrice - (currentPrice * 0.05)), // Assume 5% drop each month
    past_5_year_price: currentPrice * 0.7, // Assume price 5 years ago was 70% of current
    past_10_year_price: currentPrice * 0.5, // 50% of current
    past_15_year_price: currentPrice * 0.3, // 30% of current
    mortgage_monthly_payment: monthlyPayment.toFixed(2),
    mortgage_amount: mortgageAmount.toFixed(2),
    mortgage_interest_rate: interestRate,
    loan_term_years: loanTermYears,
    equity: (currentPrice - mortgageAmount).toFixed(2), // Assume equity is the difference
    down_payment: (currentPrice * 0.2).toFixed(2), // Assume 20% down payment
    maintenance: (currentPrice * 0.01).toFixed(2), // Assume 1% of the price as annual maintenance
    taxes: (currentPrice * 0.0125).toFixed(2), // Assume 1.25% of the price as annual taxes
    insurance: (currentPrice * 0.005).toFixed(2), // Assume 0.5% of the price as annual insurance
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
