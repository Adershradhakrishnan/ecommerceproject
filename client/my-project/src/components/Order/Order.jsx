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

    // Function to calculate total price of all products
    const calculateTotalPrice = (products, quantities) => {
        let totalPrice = 0;

        products.forEach((product, index) => {
            const quantity = quantities[index];
            if (quantity && !isNaN(quantity)) { // Check if quantity exists and is a valid number
                totalPrice += product.price * quantity;
            }
        });

        return totalPrice;
    }

    return (
        <div className="order-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {orderItems.map((order, index) => (
                <div key={index} className="order-card border border-gray-200 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 bg-white">
                    <div className="p-4">
                        <h3 className="text-xl font-bold mb-2 text-indigo-600">Order #{index + 1}</h3>
                        <div className="mb-4">
                            <p className="text-sm"><span className="font-semibold text-gray-700">User Name:</span> {order.userId.name}</p>
                            <p className="text-sm"><span className="font-semibold text-gray-700">User Email:</span> {order.userId.email}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {order.products.map((product, productIndex) => (
                                <div key={productIndex} className="product-item border border-gray-200 rounded-lg overflow-hidden shadow-md">
                                    <img 
                                        src={`http://localhost:3100${product.imageFile}`} 
                                        alt={product.name} 
                                        className="w-full h-48 object-contain" 
                                    />
                                    <div className="p-3 bg-gray-50">
                                        <p className="font-semibold text-gray-800">{product.name}</p>
                                        <p className="text-gray-700">${product.price}</p>
                                        <div className="text-blue-700">
                                            Quantity: {order.quantities && order.quantities[productIndex] ? order.quantities[productIndex] : 0}
                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                         
                        <div className="p-4 bg-gray-200">
                            <p className="font-semibold">Total Price: RS.{calculateTotalPrice(order.products, order.quantities).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Order;
