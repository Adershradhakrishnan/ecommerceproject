import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming using React Router

function HomePage() {
    const [showContents, setShowContents] = useState(false);

    const toggleContents = () => {
        setShowContents(!showContents);
    };

    return (
        <div className="container mx-auto py-8 bg-gradient-to-r from-blue-500 to-orange-500 py-4">
            <button 
                onClick={toggleContents}
                className="bg-violet-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                {showContents ? "Hide" : "Show"} Home Contents
            </button>
            {showContents && (
                <div className="mt-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Our eCommerce Store!</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Featured Products */}
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">Featured Items</h2>
                            {/* Display featured clothes */}
                            <Link to="/" className="text-blue-500 hover:underline">Explore Items</Link>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">Featured Brands</h2>
                            {/* Display featured shoes */}
                            <Link to="/" className="text-blue-500 hover:underline">Explore Brands</Link>
                        </div>
                        {/* Add more featured categories */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
