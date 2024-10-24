const BrokerCard = ({ broker }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 m-4">
        <img 
          src="https://via.placeholder.com/150" 
          alt={broker.name} 
          className="rounded-lg mb-4"
        />
        <h2 className="text-xl font-semibold">{broker.name}</h2>
        <p className="text-sm text-gray-700">{broker.specialization}</p>
        <p className="text-lg font-bold">${broker.fee} fee</p>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Book Appointment
        </button>
      </div>
    );
  };
  
  export default BrokerCard;
  