"use client";

import { useState } from 'react';
import InputField from './components/InputField';
import ResultDisplay from './components/ResultDisplay';

const MortCalculatorPage = () => {
  const [price, setPrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [term, setTerm] = useState(25); // default 25-year term
  const [result, setResult] = useState(null);

  // Function to calculate mortgage payment
  const calculateMortgage = () => {
    const loanAmount = price - (price * downPayment / 100);
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = term * 12;

    const payment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    setResult(payment.toFixed(2));
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 mt-10 rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Mortgage Calculator</h2>

      <InputField
        label="Price ($)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter the home price"
      />

      <InputField
        label="Down Payment (%)"
        type="number"
        value={downPayment}
        onChange={(e) => setDownPayment(e.target.value)}
        placeholder="Enter down payment percentage"
      />

      <InputField
        label="Interest Rate (%)"
        type="number"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        placeholder="Enter interest rate"
      />

      <InputField
        label="Loan Term (Years)"
        type="number"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Enter loan term"
      />

      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700"
        onClick={calculateMortgage}
      >
        Calculate
      </button>

      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default MortCalculatorPage;
