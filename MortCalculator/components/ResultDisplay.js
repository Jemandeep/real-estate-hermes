import React from 'react';

const ResultDisplay = ({ result }) => {
  return (
    <div className="bg-blue-100 p-4 rounded shadow-md mt-6">
      <h3 className="text-xl font-bold text-blue-600">Mortgage Payment</h3>
      <p className="text-lg">Your monthly payment: <span className="font-bold">${result}</span></p>
    </div>
  );
};

export default ResultDisplay;
