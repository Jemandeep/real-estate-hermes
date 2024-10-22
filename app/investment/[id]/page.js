import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import realEstateInvestments from '../../data/realEstateInvestments'; // If your data is in a separate file

const InvestmentDetailPage = () => {
    const router = useRouter();
    const { id } = router.query; // Get the investment ID from the URL

    const investment = realEstateInvestments.find((inv) => inv.id === parseInt(id));

    if (!investment) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <NavBar /> {/* Add the NavBar here */}
            <div className="container mx-auto p-6 pt-16">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{investment.propertyType}</h1>
                <h2 className="text-xl text-gray-600 mb-8">{investment.location}</h2>
                <img src={investment.image} alt={investment.propertyType} className="w-full h-64 object-cover rounded-lg mb-6" />
                <p className="text-gray-700"><strong>Square Footage:</strong> {investment.squareFootage}</p>
                <p className="text-gray-700"><strong>Bedrooms:</strong> {investment.bedrooms} <strong>Bathrooms:</strong> {investment.bathrooms}</p>
                <p className="text-gray-700"><strong>Potential Return:</strong> {investment.potentialReturn}</p>
                <p className="text-gray-700"><strong>Projected Appreciation:</strong> {investment.projectedAppreciation}</p>
                <p className="text-gray-600 mt-4">{investment.description}</p>
            </div>
        </div>
    );
};

export default InvestmentDetailPage;
