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

  const [income, setIncome] = useState(0);
  const [monthlyDebts, setMonthlyDebts] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [maxAffordablePayment, setMaxAffordablePayment] = useState(0);
  const [maxAffordablePrice, setMaxAffordablePrice] = useState(0);

  const [monthlyRent, setMonthlyRent] = useState(0);
  const [vacancyRate, setVacancyRate] = useState(0);
  const [rentalYield, setRentalYield] = useState(0);

  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [annualReturns, setAnnualReturns] = useState(0);
  const [roi, setRoi] = useState(0);

  useEffect(() => {
    const downPaymentAmount = downPayment; // Down payment as a dollar amount
    const loanAmount = Math.max(price - downPaymentAmount, 0); // Ensure loan amount is not negative
    const downPaymentPercentage = (downPaymentAmount / price) * 100;
    
    const insuranceRate = downPaymentPercentage < 10 ? 0.04 : downPaymentPercentage < 15 ? 0.031 : downPaymentPercentage < 20 ? 0.028 : 0;
    const cmhcInsurance = downPaymentPercentage < 20 ? loanAmount * insuranceRate : 0;

    setCmhcInsurance(cmhcInsurance);
    const totalMortgage = loanAmount + cmhcInsurance;
    setTotalMortgage(totalMortgage);

    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = term * 12;
    
    if (totalMortgage > 0 && interestRate > 0) {
      const payment = totalMortgage * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) /
                      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      setMonthlyPayment(payment.toFixed(2));
    } else {
      setMonthlyPayment(0);
    }

    if (downPayment < 20) {
      setInvestmentAdvice("Since your down payment is less than 20%, you'll need CMHC insurance. Consider building an emergency savings fund to cover potential homeownership costs.");
    } else {
      setInvestmentAdvice("Great job saving for a larger down payment! You may want to invest in home improvements to increase property value over time.");
    }

    const totalMonthlyDebt = monthlyDebts + monthlyExpenses;
    const maxPayment = (income * 0.28) - totalMonthlyDebt; 
    setMaxAffordablePayment(maxPayment > 0 ? maxPayment : 0);

    if (maxPayment > 0) {
      const maxPrice = (maxPayment * (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments));
      setMaxAffordablePrice(maxPrice.toFixed(2));
    } else {
      setMaxAffordablePrice(0);
    }

    const effectiveRent = monthlyRent * (1 - vacancyRate / 100);
    const rentalYield = (effectiveRent * 12 / price) * 100; 
    setRentalYield(rentalYield.toFixed(2));

    if (investmentAmount > 0) {
      const calculatedRoi = (annualReturns / investmentAmount) * 100; 
      setRoi(calculatedRoi.toFixed(2));
    }
  }, [price, downPayment, interestRate, term, income, monthlyDebts, monthlyExpenses, monthlyRent, vacancyRate, investmentAmount, annualReturns]);

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
              <span>Down Payment ($)</span>
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
          placeholder="Enter down payment amount"
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

        <div className="mt-6 p-4 border rounded bg-blue-50">
          <h3 className="text-xl font-semibold mb-2">Investment Recommendations</h3>
          <p className="text-gray-700">{investmentAdvice}</p>
        </div>

        <div className="mt-10 p-6 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mb-6 text-center">Affordability Calculator</h2>
          
          <InputField
            label="Monthly Income ($)"
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value))}
            placeholder="Enter your monthly income"
          />

          <InputField
            label="Monthly Debts ($)"
            type="number"
            value={monthlyDebts}
            onChange={(e) => setMonthlyDebts(parseFloat(e.target.value))}
            placeholder="Enter your monthly debts"
          />

          <InputField
            label="Monthly Expenses ($)"
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value))}
            placeholder="Enter your monthly expenses"
          />

          <div className="mt-4 p-4 border border-gray-200 rounded">
            <p className="text-lg">Maximum Affordable Monthly Payment: <span className="font-bold">${maxAffordablePayment.toFixed(2)}</span></p>
            <p className="text-lg">Maximum Affordable Home Price: <span className="font-bold">${maxAffordablePrice}</span></p>
          </div>
        </div>

        <div className="mt-10 p-6 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mb-6 text-center">Rental Income Calculator</h2>
          
          <InputField
            label="Expected Monthly Rent ($)"
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(parseFloat(e.target.value))}
            placeholder="Enter expected monthly rent"
          />
          
          <InputField
            label="Vacancy Rate (%)"
            type="number"
            value={vacancyRate}
            onChange={(e) => setVacancyRate(parseFloat(e.target.value))}
            placeholder="Enter vacancy rate percentage"
          />

          <div className="mt-4 p-4 border border-gray-200 rounded">
            <p className="text-lg">Estimated Rental Yield: <span className="font-bold">{rentalYield}%</span></p>
          </div>
        </div>

        <div className="mt-10 p-6 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mb-6 text-center">ROI Analysis</h2>
          
          <InputField
            label="Investment Amount ($)"
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(parseFloat(e.target.value))}
            placeholder="Enter investment amount"
          />
          
          <InputField
            label="Expected Annual Returns ($)"
            type="number"
            value={annualReturns}
            onChange={(e) => setAnnualReturns(parseFloat(e.target.value))}
            placeholder="Enter expected annual returns"
          />

          <div className="mt-4 p-4 border border-gray-200 rounded">
            <p className="text-lg">Return on Investment (ROI): <span className="font-bold">{roi}%</span></p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MortgageCalculator;
