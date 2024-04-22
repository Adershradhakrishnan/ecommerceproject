import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "./Navbar/Navbar";
import { Link } from "react-router-dom";

function GetProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayProducts, setDisplayProducts] = useState(false);

    const handleViewUser = (productId) => {
        if (productId !== undefined) {
            console.log("View button clicked for ID:", productId);
            // You can perform further actions based on the product ID
        } else {
            console.error("ID is undefined");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3100/getproduct');
                setProducts(response.data.data); // Assuming response.data.data contains products array
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductToggle = (showProducts) => {
        setDisplayProducts(showProducts);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Navbar handleClick={handleProductToggle} />
            <h1 className="text-3xl font-bold mb-4">Products</h1>
            {displayProducts && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-500">
                                {product.imageFile && (
                                    <img
                                        src={`http://localhost:3100${product.imageFile}`}
                                        alt={product.productName}
                                        className="w-full h-64 object-contain rounded-lg shadow-md"
                                        style={{ objectFit: 'contain' }}
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.productName}</h3>
                                    <p className="text-gray-600 mb-2">Price: <span className="text-green-600 font-semibold">${product.price}</span></p>
                                    {/* Render other product details here */}
                                    <div className="flex flex-wrap mb-2">
                                        {product.tags.split(',').map((tag) => (
                                            <span key={tag} className="text-blue-600 bg-blue-100 px-2 py-1 rounded-md mr-2 mb-2">{tag.trim()}</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-2">Shipping Method: <span className="text-purple-600">{product.shippingMethod}</span></p>
                                    <p className="text-gray-600 mb-2">Seller: <span className="text-yellow-600 font-semibold">{product.sellerName}</span></p>
                                    <p className="text-gray-600 mb-2">Contact Email: <a href={`mailto:${product.contactEmail}`} className="text-blue-600 hover:underline">{product.contactEmail}</a></p>
                                </div>
                             <Link to={`/getproduct/${product._id}`}> <button
                                    className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                                    onClick={() => handleViewUser(product._id)}
                                >
                                    View Details
                                </button></Link>  
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default GetProduct;












