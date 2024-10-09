"use client";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const InputField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

const MortgageCalculator = () => {
  const [price, setPrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [cmhcInsurance, setCmhcInsurance] = useState(0);
  const [totalMortgage, setTotalMortgage] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [term, setTerm] = useState(25);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [showDownPaymentInfo, setShowDownPaymentInfo] = useState(false);
  const [investmentAdvice, setInvestmentAdvice] = useState("");

  useEffect(() => {
    const downPaymentAmount = price * (downPayment / 100);
    const loanAmount = price - downPaymentAmount;
    const insuranceRate = downPayment < 10 ? 0.04 : downPayment < 15 ? 0.031 : downPayment < 20 ? 0.028 : 0;
    const cmhcInsurance = downPayment < 20 ? loanAmount * insuranceRate : 0;
    setCmhcInsurance(cmhcInsurance);
    const totalMortgage = loanAmount + cmhcInsurance;
    setTotalMortgage(totalMortgage);

    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = term * 12;
    const payment = totalMortgage * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    setMonthlyPayment(payment.toFixed(2));

    if (downPayment < 20) {
      setInvestmentAdvice(
        "Since your down payment is less than 20%, you'll need CMHC insurance. Consider building an emergency savings fund to cover potential homeownership costs."
      );
    } else {
      setInvestmentAdvice(
        "Great job saving for a larger down payment! You may want to invest in home improvements to increase property value over time."
      );
    }
  }, [price, downPayment, interestRate, term]);

  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white shadow-md p-6 mt-10 rounded">
        <h2 className="text-2xl font-bold mb-6 text-center">Mortgage Calculator</h2>

        <InputField
          label="Home Price ($)"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          placeholder="Enter the home price"
        />
        
        <InputField
          label={
            <div className="flex items-center">
              <span>Down Payment (%)</span>
              <span
                className="ml-2 cursor-pointer text-blue-500"
                onClick={() => setShowDownPaymentInfo(!showDownPaymentInfo)}
              >
                ℹ️
              </span>
              {showDownPaymentInfo && (
                <div className="p-4 border rounded-md bg-gray-50 text-sm text-gray-700 mt-2">
                  In Canada, if your down payment is less than 20%, CMHC insurance is required. It protects the lender in case you can't make payments. The rate depends on your down payment amount.
                </div>
              )}
            </div>
          }
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(parseFloat(e.target.value))}
          placeholder="Enter down payment percentage"
        />

        <InputField
          label="Interest Rate (%)"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          placeholder="Enter interest rate"
        />
        
        <InputField
          label="Loan Term (Years)"
          type="number"
          value={term}
          onChange={(e) => setTerm(parseInt(e.target.value))}
          placeholder="Enter loan term"
        />

          <div className="mt-4 p-4 border-t border-gray-200">
          <p className="text-lg">CMHC Insurance: <span className="font-bold">${cmhcInsurance.toFixed(2)}</span></p>
          <p className="text-lg">Total Mortgage: <span className="font-bold">${totalMortgage.toFixed(2)}</span></p>
          <div className="mt-4 p-4 border-2 border-red-500 rounded">
          <p className="text-lg">Monthly Payment: <span className="font-bold">${monthlyPayment}</span></p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="text-xl font-semibold mb-2">Investment Recommendations</h3>
          <p className="text-gray-700">{investmentAdvice}</p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            The Canada Mortgage and Housing Corporation (CMHC) insurance is required for down payments less than 20%. Based on your current home price of <strong>${price}</strong> and a down payment of <strong>{downPayment}%</strong>, your CMHC insurance is calculated at <strong>${cmhcInsurance.toFixed(2)}</strong>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MortgageCalculator;
