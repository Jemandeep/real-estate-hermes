"use client";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation"; 

const BookAppointment = () => {
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const router = useRouter(); // Initialize router for navigation

  // Generate appointment times for the next 3, 6, and 9 days
  const generateTimeOptions = () => {
    const currentDate = new Date();
    const options = [];
    [3, 6, 9].forEach((day) => {
      const appointmentDate = new Date(currentDate);
      appointmentDate.setDate(currentDate.getDate() + day);
      options.push(appointmentDate.toDateString());
    });
    setTimeOptions(options);
    setShowTimeSelector(true); // Show the time selector modal
  };

  const handleBookAppointment = () => {
    if (selectedBroker && selectedTime) {
      alert(`Appointment with ${selectedBroker} booked successfully for ${selectedTime}!`);
      // Reset the state after booking
      setSelectedBroker(null);
      setSelectedTime("");
      setTimeOptions([]);
      setShowTimeSelector(false); // Hide the modal
      router.push("/"); // Redirect to the home page
    } else {
      alert("Please select a broker and a time.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 pt-32">
        <h1 className="text-3xl font-bold mb-4">Book an Appointment</h1>

        {/* Why Trust Our Brokers section */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Why Trust Our Brokers?</h2>
          <ul className="list-disc list-inside">
            <li>Experienced professionals with a proven track record.</li>
            <li>Comprehensive knowledge of local market trends.</li>
            <li>Personalized service tailored to your unique needs.</li>
            <li>Transparent communication and support throughout the process.</li>
          </ul>
        </div>

        {/* Broker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "John Smith", image: "/images/bm1.jpg", contact: "john.smith@example.com", description: "Specializes in residential properties with 5 years of experience." },
            { name: "Michael Johnson", image: "/images/bm2.jpg", contact: "michael.johnson@example.com", description: "Expert in commercial real estate with a focus on investment." },
            { name: "David Williams", image: "/images/bm3.jpg", contact: "david.williams@example.com", description: "Dedicated to finding the best deals for first-time home buyers." },
            { name: "Emily Davis", image: "/images/bf1.jpg", contact: "emily.davis@example.com", description: "Experienced in luxury properties and high-end listings." },
            { name: "Sophia Brown", image: "/images/bf2.jpg", contact: "sophia.brown@example.com", description: "Focused on residential sales with excellent negotiation skills." },
            { name: "Olivia Wilson", image: "/images/bf3.jpg", contact: "olivia.wilson@example.com", description: "Specializes in rental properties and helping tenants find homes." },
          ].map((broker, index) => (
            <div key={index} className="border rounded-lg bg-white p-4 text-center">
              <img src={broker.image} alt={broker.name} className="mx-auto mb-2 rounded-full" />
              <h3 className="font-bold">{broker.name}</h3>
              <p className="text-sm">{broker.contact}</p>
              <p className="text-sm mb-2">{broker.description}</p>
              <button
                className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
                onClick={() => {
                  setSelectedBroker(broker.name);
                  generateTimeOptions();
                }}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>

        {/* Overlay for Time Selection */}
        {showTimeSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Select Appointment Time with {selectedBroker}</h2>
              <form className="mb-4">
                {timeOptions.map((time, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio" // Changed to radio to allow single selection
                      id={`time-${index}`}
                      name="appointmentTime" // Ensure only one can be selected
                      className="mr-2"
                      checked={selectedTime === time} // Control checked state
                      onChange={() => setSelectedTime(time)} // Set selected time on change
                    />
                    <label htmlFor={`time-${index}`} className="text-sm">{time}</label>
                  </div>
                ))}
              </form>
              <button
                className="bg-green-500 text-white py-1 px-4 rounded mr-2"
                onClick={handleBookAppointment}
              >
                Confirm Appointment
              </button>
              <button
                className="bg-red-500 text-white py-1 px-4 rounded"
                onClick={() => setShowTimeSelector(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookAppointment;
