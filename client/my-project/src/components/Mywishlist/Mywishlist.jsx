import React, { useEffect, useState } from "react";
import axios from "axios";

function Mywishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const accessToken = localStorage.getItem("token");

    useEffect(() => {
        const fetchWishlistItems = async () => {
            try {
                if (!accessToken) {
                    console.error("Access token not found in localStorage");
                    return;
                }

                // Decode the access token to extract userId
                let payloadBase64;
                try {
                    payloadBase64 = accessToken.split('.')[1];
                    if (!payloadBase64) {
                        throw new Error("Invalid access token format");
                    }
                } catch (error) {
                    console.error("Error parsing token:", error);
                    return;
                }

                let decodedPayload;
                try {
                    decodedPayload = atob(payloadBase64);
                    if (!decodedPayload) {
                        throw new Error("Failed to decode access token");
                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                    return;
                }

                let decodedToken;
                try {
                    decodedToken = JSON.parse(decodedPayload);
                    if (!decodedToken) {
                        throw new Error("Failed to parse decoded token");
                    }
                } catch (error) {
                    console.error("Error parsing decoded token:", error);
                    return;
                }

                const userId = decodedToken.user_id;
                if (!userId) {
                    console.error("User ID not found in token");
                    return;
                }

                console.log("User ID:", userId);

                // Make the request with userId included in the query parameters
                const response = await axios.get('http://localhost:3100/wishlist/item', {
                    params: { userId: userId }
                });

                console.log("Response from fetchWishlistItems:", response.data);

                setWishlistItems(response.data); // Update state with the received wishlist items
            } catch (error) {
                console.error("Error fetching wishlist items:", error);
            }
        };

        fetchWishlistItems();
    }, [accessToken]); // Include accessToken in the dependency array

    // const calculateTotalPrice = (products) => {
    //     return products.reduce((total, product) => total + product.price,0);
    // };

    return (
        <div className="wishlist-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistItems.map((wishlist, index) => (
                <div key={index} className="wishlist-card border rounded-lg overflow-hidden shadow-lg">
                    <div className="p-4">
                        <div className="mb-4">
                            <p><span className="font-semibold">User Name:</span> {wishlist.userId?.name}</p>
                            <p><span className="font-semibold">User Email:</span> {wishlist.userId?.email}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {wishlist.products.map((product, productIndex) => (
                                <div key={productIndex} className="product-item">
                                    <img src={`http://localhost:3100${product.imageFile}`} alt={product.name} className="w-full h-64 object-contain" />
                                    <div className="p-4">
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-gray-700">Total Price :${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <div className="mt-4">
                            <p className="font-semibold">Total Price: ${calculateTotalPrice(wishlist.products)}</p>
                        </div> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Mywishlist;
