import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CartProduct() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [reviewData, setReviewData] = useState({
        userName: "",
        rating: 0,
        comment: ""
    });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3100/cart/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Error fetching product. Please try again later.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, reviewSubmitted]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData({
            ...reviewData,
            [name]: value
        });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        console.log("handlesubmitreview:",handleSubmitReview);

        try {
            const response = await axios.post(`http://localhost:3100/addreview/${productId}`, reviewData);
            console.log("Review submitted successfully:", response.data);
            setReviewSubmitted(true);
            
            setShowReviewForm(false);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const addToCart = async () => {
        try {
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
    
            const response = await axios.post(
                'http://localhost:3100/cart/add',
                { userId: userId, productId: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("Response from addToCart:", response.data);
    
            // Handle success message or other actions here
            setIsAddedToCart(true);
        } catch (error) {
            console.error("Error adding to cart:", error);
            // Handle error (display message to the user, log error, etc.)
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-8">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold mb-12 text-center text-blue-600">Product Details</h1>
                {product && (
                    <div className="bg-blue-50 rounded-lg shadow-xl overflow-hidden">
                        <div className="bg-blue-200 h-72 flex items-center justify-center">
                            <img
                                src={`http://localhost:3100${product.imageFile}`}
                                alt={product.productName}
                                className="object-cover h-48"
                            />
                        </div>
                        <div className="p-8">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{product.productName}</h2>
                            <p className="text-xl text-gray-800 mb-6">Price: ${product.price}</p>
                            <p className="text-xl text-gray-800 mb-6">Tags: {product.tags}</p>
                            <p className="text-xl text-gray-800 mb-6">Shipping Method: {product.shippingMethod}</p>
                            <p className="text-xl text-gray-800 mb-6">Seller Name: {product.sellerName}</p>
                            <p className="text-xl text-gray-800 mb-8">Contact Email: {product.contactEmail}</p>
    
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold mb-6 text-blue-600">Reviews</h3>
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map((review, index) => (
                                        <div key={index} className="bg-yellow-100 rounded-lg shadow-md p-6 mb-6">
                                            <p className="text-gray-900 text-lg font-semibold mb-3">{review.userName}</p>
                                            <p className="text-gray-700 mb-2">Rating: {review.rating}/5</p>
                                            <p className="text-gray-800">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-800">No reviews yet.</p>
                                )}
                            </div>
    
                            {isAddedToCart ? (
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline mr-4"
                                >
                                    Go to Cart
                                </button>
                            ) : (
                                <button
                                    onClick={addToCart}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline mr-4"
                                >
                                    Add to Cart
                                </button>
                            )}
    
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                {showReviewForm ? "Hide Review Form" : "Add Review"}
                            </button>
                        </div>
    
                        {showReviewForm && (
                            <form onSubmit={handleSubmitReview} className="p-8 bg-blue-100 rounded-b-lg">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    name="userName"
                                    value={reviewData.userName}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 border border-gray-400 rounded-lg mb-6 focus:outline-none focus:border-blue-600"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Rating (1-5)"
                                    name="rating"
                                    min="1"
                                    max="5"
                                    value={reviewData.rating}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 border border-gray-400 rounded-lg mb-6 focus:outline-none focus:border-blue-600"
                                    required
                                />
                                <textarea
                                    placeholder="Comment"
                                    name="comment"
                                    value={reviewData.comment}
                                    onChange={handleInputChange}
                                    className="w-full h-40 px-5 py-3 border border-gray-400 rounded-lg mb-6 focus:outline-none focus:border-blue-600 resize-none"
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline"
                                >
                                    Submit Review
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
    
}

export default CartProduct;









