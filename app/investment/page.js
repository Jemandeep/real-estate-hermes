    "use client";
    import React from 'react';

    const realEstateInvestments = [
    {
        id: 1,
        propertyType: 'Single Family Home',
        location: 'Downtown, City A',
        squareFootage: '1,500 sq ft',
        bedrooms: 3,
        bathrooms: 2,
        potentialReturn: '8%',
        projectedAppreciation: '3% per year',
        description: 'This beautiful single-family home in downtown City A features modern amenities, a spacious backyard, and is within walking distance of schools and parks. Perfect for families or as a rental investment.',
        image: 'https://dummyimage.com/400x250/000/fff',
    },
    {
        id: 2,
        propertyType: 'Luxury Condo',
        location: 'Uptown, City B',
        squareFootage: '1,200 sq ft',
        bedrooms: 2,
        bathrooms: 2,
        potentialReturn: '6%',
        projectedAppreciation: '4% per year',
        description: 'Experience upscale living in this luxury condo with breathtaking views of the skyline. Amenities include a fitness center, rooftop pool, and concierge services. Ideal for young professionals and investors alike.',
        image: 'https://dummyimage.com/400x250/111/fff',
    },
    {
        id: 3,
        propertyType: 'Duplex',
        location: 'Suburbs, City C',
        squareFootage: '2,000 sq ft',
        bedrooms: 4,
        bathrooms: 3,
        potentialReturn: '7%',
        projectedAppreciation: '5% per year',
        description: 'This well-maintained duplex offers great rental potential with two separate units. Located in a family-friendly neighborhood, it’s perfect for investors looking for steady income. Recent upgrades include a new roof and renovated kitchens.',
        image: 'https://dummyimage.com/400x250/222/fff',
    },
    {
        id: 4,
        propertyType: 'Commercial Property',
        location: 'Business District, City D',
        squareFootage: '5,000 sq ft',
        bedrooms: 0,
        bathrooms: 2,
        potentialReturn: '10%',
        projectedAppreciation: '2% per year',
        description: 'Prime commercial space available in the bustling business district of City D. This property is suitable for retail, office space, or mixed-use development. High visibility and foot traffic make it an ideal investment opportunity.',
        image: 'https://dummyimage.com/400x250/333/fff',
    },
    ];

    const RealEstateInvestmentsPage = () => {
        return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Real Estate Investment Opportunities</h1>
            <div className="grid grid-cols-1 gap-6">
            {realEstateInvestments.map((investment) => (
                <div key={investment.id} className="bg-white shadow-lg rounded-lg p-6 flex items-start hover:shadow-xl transform hover:scale-105 transition duration-200">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800">{investment.propertyType}</h2>
                    <p className="text-gray-700"><strong>Location:</strong> {investment.location}</p>
                    <p className="text-gray-700"><strong>Square Footage:</strong> {investment.squareFootage}</p>
                    <p className="text-gray-700"><strong>Bedrooms:</strong> {investment.bedrooms} <strong>Bathrooms:</strong> {investment.bathrooms}</p>
                    <p className="text-gray-700"><strong>Potential Return:</strong> {investment.potentialReturn}</p>
                    <p className="text-gray-700"><strong>Projected Appreciation:</strong> {investment.projectedAppreciation}</p>
                    <p className="text-gray-600 mb-4">{investment.description}</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    View Details
                    </button>
                </div>
                <img src={investment.image} alt={investment.propertyType} className="w-72 h-auto object-cover rounded-md ml-4" /> {/* Increased width to w-72 */}
                </div>
            ))}
            </div>
        </div>
        );
    };
    
    export default RealEstateInvestmentsPage;
    

