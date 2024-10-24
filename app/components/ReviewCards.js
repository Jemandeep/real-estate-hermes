// components/ReviewCards.js

// Random review data
const reviews = [
    {
      name: "John Doe",
      review: "Fantastic real estate service! Found my dream home in just two weeks.",
      stars: 5,
    },
    {
      name: "Jane Smith",
      review: "The agents were very professional and helped me through the whole process.",
      stars: 4,
    },
    {
      name: "David Johnson",
      review: "Had a great experience with Calgary Real Estate. Highly recommend!",
      stars: 5,
    },
    {
      name: "Emily Brown",
      review: "Good service, but it took a little longer than expected to find the right property.",
      stars: 3,
    },
    {
      name: "Michael Wilson",
      review: "Wonderful experience! Very helpful and knowledgeable agents.",
      stars: 4,
    }
  ];
  
  // Helper function to generate star ratings
  const generateStars = (stars) => {
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };
  
  const ReviewCards = () => {
    // Inline styles for the container and animation
    const containerStyle = {
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
      height: '200px',
      width: '100%',
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
    };
  
    const cardStyle = {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '250px',
      textAlign: 'center',
      marginRight: '20px',
      animationName: 'scroll',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    };
  
    const marqueeStyle = {
      display: 'flex',
      gap: '20px',
      position: 'absolute',
      animation: `scroll 20s linear infinite`, // Set a constant animation duration
    };
  
    const starsStyle = {
      color: 'gold',
      fontSize: '1.2rem',
    };
  
    return (
      <div style={containerStyle}>
        <div style={marqueeStyle}>
          {reviews.map((review, index) => (
            <div key={index} className="review-card" style={cardStyle}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{review.name}</h3>
              <p style={{ fontSize: '1rem', marginBottom: '10px' }}>{review.review}</p>
              <div style={starsStyle}>{generateStars(review.stars)}</div>
            </div>
          ))}
        </div>
  
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </div>
    );
  };
  
  export default ReviewCards;
  