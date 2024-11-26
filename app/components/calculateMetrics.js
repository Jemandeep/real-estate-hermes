export const calculateMetrics = (properties) => {
    let totalInvestment = 0;
    let currentPortfolioValue = 0;
    let cashFlow = 0;
  
    properties.forEach((property) => {
      const purchasedPrice = parseFloat(property.purchased_price || 0);
      const currentPrice = parseFloat(property.current_price || 0);
      const rentPrice = parseFloat(property.rent_price || 0);
      const mortgageMonthly = parseFloat(property.mortgage_monthly_payment || 0);
      const maintenance = parseFloat(property.maintenance || 0) / 12;
      const insurance = parseFloat(property.insurance || 0) / 12;
      const taxes = parseFloat(property.taxes || 0) / 12;
  
      totalInvestment += purchasedPrice;
      currentPortfolioValue += currentPrice;
  
      if (property.is_for_rent) {
        const propertyCashFlow =
          rentPrice - mortgageMonthly - maintenance - insurance - taxes;
        cashFlow += propertyCashFlow;
      }
    });
  
    const roi =
      totalInvestment > 0
        ? ((currentPortfolioValue - totalInvestment) / totalInvestment) * 100
        : 0;
  
    return {
      totalInvestment,
      currentPortfolioValue,
      roi,
      cashFlow,
    };
  };
  