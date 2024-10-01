import React from 'react'
import Card from './card';

function advice() {
  return (
    <div className="flex justify-around flex-wrap p-10">
      <Card 
        imageSrc="/images/logo1.png"
        title="House Trends"
        description="Get the inside track and discover the trends and market insights that can only come from the largest network of real estate agents across Canada."
        link="/page1"
      />
      <Card 
        imageSrc="/images/logo2.png"
        title="Buying and Selling tips"
        description="Why start from scratch when you can learn from the best. We've done the work for you by compiling our best tips and tricks on how to win in today's market."
        link="/page2"
      />
      <Card 
        imageSrc="/images/logo3.png"
        title="First Time buyers"
        description="Get a step-by-step walkthrough of everything you need to do to get into the home buying process with confidence."
        link="/page3"
      />
    </div>
  )
}

export default advice;