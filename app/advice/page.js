// components/Advice.js

import React from 'react';
import Card from './Card';

function Advice() {
  return (
    <div className="flex justify-around flex-wrap p-10">
      <Card 
        imageSrc="/images/logo1.jpg"
        title="House Trends"
        description="Get the inside track and discover the trends and market insights that can only come from the largest network of real estate agents across Canada."
        link="advice/page1"
      />
      <Card 
        imageSrc="/images/logo2.jpg"
        title="Buying and Selling Tips"
        description="Why start from scratch when you can learn from the best. We've done the work for you by compiling our best tips and tricks on how to win in today's market."
        link="advice/page2"
      />
      <Card 
        imageSrc="/images/logo3.jpg"
        title="First Time Buyers"
        description="Get a step-by-step walkthrough of everything you need to do to get into the home buying process with confidence."
        link="advice/page3"
      />
    </div>
  );
}

export default Advice;
