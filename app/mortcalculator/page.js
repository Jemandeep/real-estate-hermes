"use client";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const InputField = ({ id, label, type, value, onChange, min, max, step, placeholder, info }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-1">
        {label}
        {info && (
          <span className="ml-1 text-blue-500 cursor-pointer" title={info}>
            <InformationCircleIcon className="inline h-5 w-5" />
          </span>
        )}
      </label>
      {type === 'slider' ? (
        <>
          <input
            id={id}
            type="range"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
          <div className="text-right text-sm text-gray-600">
            {value}
            {id === 'interestRate' ? '%' : ''}
          </div>
        </>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      )}
    </div>
  );
};

const MortgageCalculator = () => {
  // Input States
  const [inputs, setInputs] = useState({
    price: 300000,
    downPayment: 60000,
    interestRate: 3.5,
    term: 25,
    propertyTaxRate: 1.2,
    insuranceRate: 0.5,
    hoaFees: 0,
    extraPayment: 0,
  });

  // Additional Inputs
  const [income, setIncome] = useState(5000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [monthlyExpenses, setMonthlyExpenses] = useState(1500);

  // Calculation Results
  const [results, setResults] = useState({
    loanAmount: 0,
    pmi: 0,
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    amortizationSchedule: [],
    paymentBreakdown: {},
    maxAffordablePayment: 0,
    maxAffordablePrice: 0,
  });

  // Toggle for Amortization Schedule
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  useEffect(() => {
    const {
      price,
      downPayment,
      interestRate,
      term,
      propertyTaxRate,
      insuranceRate,
      hoaFees,
      extraPayment,
    } = inputs;

    // Basic Calculations
    const loanAmount = Math.max(price - downPayment, 0);
    const downPaymentPercentage = (downPayment / price) * 100 || 0;

    // PMI Calculation (assuming PMI applies if down payment is less than 20%)
    const pmiRate = downPaymentPercentage < 20 ? 0.005 : 0;
    const monthlyPMI = (loanAmount * pmiRate) / 12;

    // Monthly Interest Rate and Number of Payments
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = term * 12;

    // Monthly Principal and Interest Payment
    let monthlyPI = 0;
    if (loanAmount > 0 && interestRate > 0) {
      const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
      const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
      monthlyPI = numerator / denominator;
    }

    // Monthly Property Tax and Insurance
    const monthlyPropertyTax = (price * (propertyTaxRate / 100)) / 12;
    const monthlyInsurance = (price * (insuranceRate / 100)) / 12;

    // Total Monthly Payment
    const monthlyPayment =
      monthlyPI + monthlyPMI + monthlyPropertyTax + monthlyInsurance + hoaFees + extraPayment;

    // Total Interest
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    // Payment Breakdown for Chart
    const paymentBreakdown = {
      Principal: loanAmount,
      Interest: totalInterest,
      Taxes: monthlyPropertyTax * numberOfPayments,
      Insurance: monthlyInsurance * numberOfPayments,
      PMI: monthlyPMI * numberOfPayments,
    };

    // Amortization Schedule
    const amortizationSchedule = [];
    let balance = loanAmount;
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balance * monthlyInterestRate;
      let principalPayment = monthlyPI - interestPayment + extraPayment;
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      balance -= principalPayment;
      amortizationSchedule.push({
        paymentNumber: i,
        principalPayment,
        interestPayment,
        balance: Math.max(balance, 0),
      });
      if (balance <= 0) break;
    }

    // Affordability Calculations
    const totalMonthlyDebt = monthlyDebts + monthlyExpenses;
    const maxPayment = income * 0.36 - totalMonthlyDebt;
    let maxAffordablePrice = 0;

    if (maxPayment > 0 && interestRate > 0) {
      const numerator = maxPayment * (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      const denominator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
      maxAffordablePrice = numerator / denominator;
    }

    // Update Results
    setResults({
      loanAmount: loanAmount.toFixed(2),
      pmi: monthlyPMI.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      amortizationSchedule,
      paymentBreakdown,
      maxAffordablePayment: maxPayment > 0 ? maxPayment.toFixed(2) : 0,
      maxAffordablePrice: maxAffordablePrice > 0 ? maxAffordablePrice.toFixed(2) : 0,
    });
  }, [inputs, income, monthlyDebts, monthlyExpenses]);

  // Format Currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);

  return (
    <Layout>
      <div className="max-w-10xl mx-auto bg-gray-50 p-6 mt-10 rounded">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Real Estate Investment Calculator
        </h1>

        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Input Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Purchase Details */}
            <InputField
              id="price"
              label="Home Price ($)"
              type="number"
              value={inputs.price}
              onChange={handleInputChange}
              placeholder="Enter the home price"
            />
            <InputField
              id="downPayment"
              label="Down Payment ($)"
              type="number"
              value={inputs.downPayment}
              onChange={handleInputChange}
              placeholder="Enter down payment amount"
              info="If your down payment is less than 20%, PMI is required."
            />
            <InputField
              id="interestRate"
              label="Interest Rate (%)"
              type="slider"
              value={inputs.interestRate}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
            />
            <InputField
              id="term"
              label="Loan Term (Years)"
              type="slider"
              value={inputs.term}
              onChange={handleInputChange}
              min="5"
              max="30"
              step="1"
            />
            {/* Additional Costs */}
            <InputField
              id="propertyTaxRate"
              label="Property Tax Rate (%)"
              type="number"
              value={inputs.propertyTaxRate}
              onChange={handleInputChange}
              placeholder="Enter property tax rate"
            />
            <InputField
              id="insuranceRate"
              label="Home Insurance Rate (%)"
              type="number"
              value={inputs.insuranceRate}
              onChange={handleInputChange}
              placeholder="Enter insurance rate"
            />
            <InputField
              id="hoaFees"
              label="Monthly HOA Fees ($)"
              type="number"
              value={inputs.hoaFees}
              onChange={handleInputChange}
              placeholder="Enter HOA fees"
            />
            <InputField
              id="extraPayment"
              label="Extra Monthly Payment ($)"
              type="number"
              value={inputs.extraPayment}
              onChange={handleInputChange}
              placeholder="Enter extra payment amount"
            />
            {/* Affordability Inputs */}
            <InputField
              id="income"
              label="Monthly Income ($)"
              type="number"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter your monthly income"
            />
            <InputField
              id="monthlyDebts"
              label="Monthly Debts ($)"
              type="number"
              value={monthlyDebts}
              onChange={(e) => setMonthlyDebts(parseFloat(e.target.value) || 0)}
              placeholder="Enter your monthly debts"
            />
            <InputField
              id="monthlyExpenses"
              label="Monthly Expenses ($)"
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
              placeholder="Enter your monthly expenses"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mortgage Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Mortgage Details</h2>
            <p className="text-lg">
              Loan Amount: <span className="font-bold">{formatCurrency(results.loanAmount)}</span>
            </p>
            <p className="text-lg">
              Monthly Payment:{' '}
              <span className="font-bold">{formatCurrency(results.monthlyPayment)}</span>
            </p>
            <p className="text-lg">
              Total Interest Paid:{' '}
              <span className="font-bold">{formatCurrency(results.totalInterest)}</span>
            </p>
            <p className="text-lg">
              Total Payment: <span className="font-bold">{formatCurrency(results.totalPayment)}</span>
            </p>
          </div>

          {/* Payment Breakdown Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Breakdown</h2>
            <div className="h-64">
              <Pie
                data={{
                  labels: Object.keys(results.paymentBreakdown),
                  datasets: [
                    {
                      data: Object.values(results.paymentBreakdown),
                      backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB', '#FFCE56', '#9C27B0'],
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>

          {/* Affordability Analysis */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Affordability Analysis</h2>
            <p className="text-lg">
              Max Affordable Monthly Payment:{' '}
              <span className="font-bold">{formatCurrency(results.maxAffordablePayment)}</span>
            </p>
            <p className="text-lg">
              Max Affordable Home Price:{' '}
              <span className="font-bold">{formatCurrency(results.maxAffordablePrice)}</span>
            </p>
          </div>

          {/* Amortization Schedule */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Amortization Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Payment #</th>
                    <th className="border px-2 py-1">Principal</th>
                    <th className="border px-2 py-1">Interest</th>
                    <th className="border px-2 py-1">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.amortizationSchedule.slice(0, 5).map((payment, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{payment.paymentNumber}</td>
                      <td className="border px-2 py-1">{formatCurrency(payment.principalPayment)}</td>
                      <td className="border px-2 py-1">{formatCurrency(payment.interestPayment)}</td>
                      <td className="border px-2 py-1">{formatCurrency(payment.balance)}</td>
                    </tr>
                  ))}
                  {!showFullSchedule && (
                    <tr>
                      <td colSpan="4" className="text-center py-2">
                        <button
                          onClick={() => setShowFullSchedule(true)}
                          className="text-blue-500 hover:underline"
                        >
                          Show Full Schedule
                        </button>
                      </td>
                    </tr>
                  )}
                  {showFullSchedule &&
                    results.amortizationSchedule.slice(5).map((payment, index) => (
                      <tr key={index + 5}>
                        <td className="border px-2 py-1">{payment.paymentNumber}</td>
                        <td className="border px-2 py-1">{formatCurrency(payment.principalPayment)}</td>
                        <td className="border px-2 py-1">{formatCurrency(payment.interestPayment)}</td>
                        <td className="border px-2 py-1">{formatCurrency(payment.balance)}</td>
                      </tr>
                    ))}
                  {showFullSchedule && (
                    <tr>
                      <td colSpan="4" className="text-center py-2">
                        <button
                          onClick={() => setShowFullSchedule(false)}
                          className="text-blue-500 hover:underline"
                        >
                          Hide Full Schedule
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MortgageCalculator;
