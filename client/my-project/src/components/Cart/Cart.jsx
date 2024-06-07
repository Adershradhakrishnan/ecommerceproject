import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

function CartProduct() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        comment: ""
    });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

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

        const fetchUserEmail = () => {
            const email = localStorage.getItem('email');
            if (email) {
                setUserEmail(email);
            }
        };

        fetchProduct();
        fetchUserEmail();
    }, [productId, reviewSubmitted]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData({
            ...reviewData,
            [name]: value
        });
    };

    const handleRatingChange = (newRating) => {
        setReviewData({
            ...reviewData,
            rating: newRating
        });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

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
            setIsAddedToCart(true);
        } catch (error) {
            console.error("Error adding to cart:", error);
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

    const isSeller = userEmail === product.contactEmail;

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-extrabold mb-12 text-center text-indigo-600">Product Details</h1>
                {product && (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="bg-gray-300 h-72 flex items-center justify-center">
                            <img
                                src={`http://localhost:3100${product.imageFile}`}
                                alt={product.productName}
                                className="object-cover h-60 rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="p-10">
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">{product.productName}</h2>
                            <p className="text-2xl text-gray-800 mb-6">Price: <span className="font-semibold">${product.price}</span></p>
                            <p className="text-lg text-gray-700 mb-6">Tags: {product.tags}</p>
                            <p className="text-lg text-gray-700 mb-6">Shipping Method: {product.shippingMethod}</p>
                            <p className="text-lg text-gray-700 mb-6">Seller Name: {product.sellerName}</p>
                            <p className="text-lg text-gray-700 mb-8">Contact Email: {product.contactEmail}</p>

                            <div className="mb-12">
                                <h3 className="text-3xl font-semibold mb-6 text-indigo-600">Reviews</h3>
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map((review, index) => (
                                        <div key={index} className="bg-indigo-100 rounded-lg shadow-md p-6 mb-6">
                                            <p className="text-gray-900 text-lg font-semibold mb-3">{review.userName}</p>
                                            <div className="mb-2">
                                                <ReactStars
                                                    count={5}
                                                    value={review.rating}
                                                    edit={false}
                                                    size={24}
                                                    activeColor="#ffd700"
                                                />
                                            </div>
                                            <p className="text-gray-800">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-800">No reviews yet.</p>
                                )}
                            </div>

                            {isSeller ? (
                                <p className="text-green-500 text-xl font-bold">This is our product</p>
                            ) : (
                                <>
                                    {isAddedToCart ? (
                                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline mr-4">
                                            Go to Cart
                                        </button>
                                    ) : (
                                        <button
                                            onClick={addToCart}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline mr-4"
                                        >
                                            Add to Cart
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline"
                                    >
                                        {showReviewForm ? "Hide Review Form" : "Add Review"}
                                    </button>
                                </>
                            )}
                        </div>

                        {showReviewForm && (
                            <form onSubmit={handleSubmitReview} className="p-8 bg-gray-50 rounded-b-lg">
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                                    <ReactStars
                                        count={5}
                                        onChange={handleRatingChange}
                                        size={24}
                                        activeColor="#ffd700"
                                    />
                                </div>
                                <textarea
                                    placeholder="Comment"
                                    name="comment"
                                    value={reviewData.comment}
                                    onChange={handleInputChange}
                                    className="w-full h-40 px-5 py-3 border border-gray-400 rounded-lg mb-6 focus:outline-none focus:border-indigo-600 resize-none"
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline"
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
