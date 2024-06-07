import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart, faHeart as fasHeart } from "@fortawesome/free-regular-svg-icons";
import Navbar from "./Navbar/Navbar";
import MyCarousel from './Carousel/Carousal';
import axios from 'axios';
import Footer from "./Footer/Footer";
import ReactStars from "react-rating-stars-component";

function Sellerlogin() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3100/getuser');
                setProducts(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again later.');
                setLoading(false);
            }
        };

        const fetchFilteredProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3100/filterproducts', {
                    params: { keyword: keyword }
                });

                setProducts(response.data.data);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again.');
                setLoading(false);
            }
        };

        if (keyword) {
            setLoading(true);
            setError(null);
            fetchFilteredProducts();
        } else {
            fetchProducts();
        }
    }, [keyword]);

    const handleViewUser = (productId) => {
        if (productId !== undefined) {
            console.log("View button clicked for ID:", productId);
            // You can perform further actions based on the product ID
        } else {
            console.error("ID is undefined");
        }
    };

    const handleFavoriteAction = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Authentication token not found. Please log in.");
            // Handle authentication error (redirect to login page, display message, etc.)
            return;
        }

        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const decodedToken = JSON.parse(decodedPayload);
        const userId = decodedToken.user_id;

        try {
            if (favorites.includes(productId)) {
                // Remove from favorites
                await axios.delete('http://localhost:3100/wishlist/remove', { data: { userId, productId } });
                setFavorites(favorites.filter(id => id !== productId));
            } else {
                // Add to favorites
                setFavorites([...favorites, productId]);
                await axios.post('http://localhost:3100/wishlist/add', { userId, productId });
            }
        } catch (error) {
            console.error('Error handling favorite:', error);
        }
    };

    const handleCategorySelect = async (category) => {
        setLoading(true);
        setError(null);

        try {
            const encodedCategory = encodeURIComponent(category);
            const response = await axios.get('http://localhost:3100/filter/categories', {
                params: { category: encodedCategory }
            });
            setProducts(response.data.data);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching filtered products', error);
            setError('Error fetching products. Please try again.');
            setLoading(false);
        }
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return 0;
        }

        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    };

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <Navbar setKeyword={setKeyword} onCategorySelect={handleCategorySelect} />

            {/* Image Carousel with Margin */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-black"> Featured Products</h1>

                {/* Add margin to the ImageCarousel */}
                <div className="mb-8">
                    <MyCarousel />
                </div>

                {loading ? (
                    <p className="text-gray-600 text-lg">Loading...</p>
                ) : error ? (
                    <p className="text-red-600 text-lg">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="relative">
                                <Link to={`/cartproduct/${product._id}`}>
                                    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-white transition duration-300 ease-in-out transform hover:scale-105">
                                        {product.imageFile && (
                                            <img
                                                src={`http://localhost:3100${product.imageFile}`} // Construct image URL
                                                alt={product.productName}
                                                className="w-full h-64 object-contain rounded-lg shadow-md"
                                                style={{ objectFit: 'contain' }}
                                            />
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold mb-2 text-yellow-700">{product.productName}</h3>
                                            <p className="text-yellow-600 mb-2">Price: <span className="text-green-600 font-semibold">${product.price}</span></p>

                                            {/* Tags Section */}
                                            <div className="flex flex-wrap mb-2">
                                                {product.tags.split(',').map((tag) => (
                                                    <span key={tag} className="text-blue-600 bg-blue-100 px-2 py-1 rounded-md mr-2 mb-2">{tag.trim()}</span>
                                                ))}
                                            </div>

                                            <p className="text-gray-600 mb-2">Shipping Method: <span className="text-purple-600">{product.shippingMethod}</span></p>

                                            {/* Average Rating Section */}
                                            <div className="flex items-center mb-2">
                                                <ReactStars
                                                    count={5}
                                                    value={calculateAverageRating(product.reviews)}
                                                    edit={false}
                                                    size={24}
                                                    activeColor="#ffd700"
                                                />
                                                {/* <span className="text-gray-700 ml-2">
                                                    {product.reviews && product.reviews.length > 0
                                                        ? `(${product.reviews.length} ${product.reviews.length > 1 ? 'reviews' : 'review'})`
                                                        : '(No reviews yet)'}
                                                </span> */}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                {/* Love symbol */}
                                <button
                                    className="absolute top-2 right-2"
                                    onClick={() => handleFavoriteAction(product._id)}
                                >
                                    <FontAwesomeIcon icon={favorites.includes(product._id) ? fasHeart : farHeart} size="lg" style={{ color: favorites.includes(product._id) ? "red" : "currentColor" }} />
                                </button>

                                <Link to={`/cartproduct/${product._id}`}>
                                    <button
                                        className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                                        onClick={() => handleViewUser(product._id)}
                                    >
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Sellerlogin;
