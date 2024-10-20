"use client";
import NavBar from "../components/NavBar";

const BookAppointment = () => {
  return (
    <>
      <NavBar /> {/* Add the NavBar here */}
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
              <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">Book Appointment</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
