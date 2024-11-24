// components/Card.js

import React from 'react';
import Link from 'next/link';

const Card = ({ imageSrc, title, description, link }) => {
    return (
        <div className="w-full max-w-lg rounded overflow-hidden shadow-lg m-4 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            {/* Image */}
            <img className="w-full h-48 object-cover" src={imageSrc} alt={title} />
            {/* Card Content */}
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">{description}</p>
            </div>
            {/* Learn More Button */}
            <div className="px-6 py-4">
                <Link
                    href={link}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Learn More
                </Link>
            </div>
        </div>
    );
};

export default Card;
