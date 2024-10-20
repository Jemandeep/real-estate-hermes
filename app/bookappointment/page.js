"use client";
import NavBar from "../components/NavBar";

const BookAppointment = () => {
  return (
    <>
      <NavBar /> {/* Add the NavBar here */}
      <div className="container mx-auto p-6 pt-32">
        <h1 className="text-3xl font-bold mb-4">Book an Appointment</h1>

        {/* Why Trust Our Brokers section */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md"> {/* Added white card */}
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
            { name: "Broker 1", image: "https://dummyimage.com/150x150/000/fff", contact: "broker1@example.com" },
            { name: "Broker 2", image: "https://dummyimage.com/150x150/000/fff", contact: "broker2@example.com" },
            { name: "Broker 3", image: "https://dummyimage.com/150x150/000/fff", contact: "broker3@example.com" },
            { name: "Broker 4", image: "https://dummyimage.com/150x150/000/fff", contact: "broker4@example.com" },
            { name: "Broker 5", image: "https://dummyimage.com/150x150/000/fff", contact: "broker5@example.com" },
            { name: "Broker 6", image: "https://dummyimage.com/150x150/000/fff", contact: "broker6@example.com" },
          ].map((broker, index) => (
            <div key={index} className="border rounded-lg bg-white p-4 text-center"> {/* Added bg-white class */}
              <img src={broker.image} alt={broker.name} className="mx-auto mb-2 rounded-full" />
              <h3 className="font-bold">{broker.name}</h3>
              <p className="text-sm">{broker.contact}</p>
              <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">Book Appointment</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
