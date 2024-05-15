import React, { useEffect, useState } from "react";
import axios from "axios";

function Order() {
    const [orderItems, setOrderItems] = useState([]);
    const accessToken = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                if (!accessToken) {
                    console.error("Access token not found in localStorage");
                    return;
                }

                // Decode the access token to extract userId
                const payloadBase64 = accessToken.split('.')[1];
                const decodedPayload = atob(payloadBase64);
                const decodedToken = JSON.parse(decodedPayload);
                const userId = decodedToken.user_id;

                // Make the request with userId included in the request body
                const response = await axios.get('http://localhost:3100/order/item', {
                    params: { userId: userId }
                });

                console.log("Response from fetchOrderItems:", response.data);

                setOrderItems(response.data); // Update state with the received order items
            } catch (error) {
                console.error("Error fetching order items:", error);
            }
        };

        fetchOrderItems();
    }, [accessToken]); // Include accessToken in the dependency array

   
    return (
        <div className="order-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {orderItems.map((order, index) => (
                <div key={index} className="order-card border border-blue-300 rounded-lg overflow-hidden shadow-xl transition-transform transform hover:scale-105 bg-white">
                    <div className="p-6">
                        <h3 className="text-2xl font-bold mb-4 text-blue-600">Order #{index + 1}</h3>
                        <div className="mb-6">
                            <p className="text-lg"><span className="font-semibold text-blue-500">User Name:</span> {order.userId.name}</p>
                            <p className="text-lg"><span className="font-semibold text-blue-500">User Email:</span> {order.userId.email}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {order.products.map((product, productIndex) => (
                                <div key={productIndex} className="product-item border border-gray-200 rounded-lg overflow-hidden">
                                    <img 
                                        src={`http://localhost:3100${product.imageFile}`} 
                                        alt={product.name} 
                                        className="w-full h-64 object-cover" 
                                    />
                                    <div className="p-4 bg-blue-50">
                                        <p className="font-semibold text-blue-700">{product.name}</p>
                                        <p className="text-gray-800">${product.price}</p>
                                    </div>
                                    {/* Render total price at the bottom of the last product */}
                                    {productIndex === order.products.length - 1 && (
                                        <div className="p-4 bg-blue-100">
                                            <p className="font-semibold text-blue-800">Total Price: ${calculateTotalPrice(order.products).toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Function to calculate total price of all products
const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => total + parseFloat(product.price), 0);
}

export default Order;



