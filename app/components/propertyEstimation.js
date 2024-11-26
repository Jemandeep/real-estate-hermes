export const handleEstimation = async (details) => {
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(`Estimated Property Value: $${data.estimatedValue.toFixed(2)}`);
      } else {
        console.error("Server error:", data);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert("Error during estimation.");
    }
  };
  