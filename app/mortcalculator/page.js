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
  }, [price, downPayment, interestRate, term]);

  return (
    <Layout>
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 mt-10 rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Mortgage Calculator</h2>

      <InputField label="Home Price ($)" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} placeholder="Enter the home price"/>
      <InputField label="Down Payment (%)" type="number" value={downPayment} onChange={(e) => setDownPayment(parseFloat(e.target.value))} placeholder="Enter down payment percentage"/>
      <InputField label="Interest Rate (%)" type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value))} placeholder="Enter interest rate"/>
      <InputField label="Loan Term (Years)" type="number" value={term} onChange={(e) => setTerm(parseInt(e.target.value))} placeholder="Enter loan term"/>

      <div className="mt-4 p-4 border-t border-gray-200">
        <p className="text-lg">CMHC Insurance: <span className="font-bold">${cmhcInsurance.toFixed(2)}</span></p>
        <p className="text-lg">Total Mortgage: <span className="font-bold">${totalMortgage.toFixed(2)}</span></p>
        <p className="text-lg">Monthly Payment: <span className="font-bold">${monthlyPayment}</span></p>
      </div>
    </div>
    </Layout>
  );
};

export default MortgageCalculator;
