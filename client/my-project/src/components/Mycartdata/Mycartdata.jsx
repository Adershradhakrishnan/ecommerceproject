import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// Define fetchCartItems function outside the component
const fetchCartItems = async () => {
  try {
    // Retrieve access token from localStorage
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      console.error("Access token not found in localStorage");
      return;
    }

    // Decode the access token to extract userId
    const payloadBase64 = accessToken.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    const decodedToken = JSON.parse(decodedPayload);
    const userId = decodedToken.user_id;

    // Fetch cart items from backend using userId as a query parameter
    const response = await axios.get('http://localhost:3100/mycart', {
      params: { userId: userId }
    });

    console.log("Response from fetchCartItems:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error; // Rethrow error to handle it in the component
  }
};

function MyCartData() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems()
      .then(data => setCartItems(data))
      .catch(error => console.error(error));
  }, []); // Empty dependency array to run the effect only once on component mount

  // Function to handle checkbox change
  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      // If checkbox is checked, add the product ID to selectedProducts
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      // If checkbox is unchecked, remove the product ID from selectedProducts
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  // Function to handle purchase button click
  const handlePurchase = async () => {
    try {
      // Retrieve access token from localStorage
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
      }

      // Decode the access token to extract userId
      const payloadBase64 = accessToken.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const decodedToken = JSON.parse(decodedPayload);
      const userId = decodedToken.user_id;

      // Send a request to move the selected products from cart to order collection
      await axios.post('http://localhost:3100/order/add', {
        userId: userId,
        productIds: selectedProducts
      });

    //   // Send a request to delete the selected products from the cart
    //   await axios.delete('http://localhost:3100/mycart/delete', {
    //     data: { userId: userId, productIds: selectedProducts }
    //   });

      // Show SweetAlert notification after purchase
      Swal.fire({
        icon: 'success',
        title: 'Purchase Successful',
        text: 'Your item has been shipped and will be delivered within 2 to 3 working days.',
      }).then((result) => {
        // Check if the alert was confirmed
        if (result.isConfirmed) {
          // Clear the selected products state and reset total price
          setSelectedProducts([]);
          setTotalPrice(0);

          // Fetch updated cart items
          fetchCartItems()
            .then(data => setCartItems(data))
            .catch(error => console.error(error));
        }
      });
    } catch (error) {
      console.error("Error purchasing items:", error);
    }
  };

  // Function to calculate total price based on selected products
  useEffect(() => {
    let totalPrice = 0;
    for (const cartItem of cartItems) {
      if (selectedProducts.includes(cartItem.productId._id)) {
        totalPrice += parseFloat(cartItem.productId.price);
      }
    }
    setTotalPrice(totalPrice);
  }, [selectedProducts, cartItems]);

  return (
    <div className="container">
      <h1 className="my-4 text-3xl font-bold text-center text-indigo-700">My Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cartItems.map((cartItem) => (
          <div key={cartItem._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={`http://localhost:3100${cartItem.productId.imageFile}`}
              className="w-full h-64 object-contain"
              alt={cartItem.productId.productName}
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-indigo-700">{cartItem.productId.productName}</h3>
              <p className="text-lg text-gray-800 my-2">
                <strong>Price:</strong> <span className="text-green-600">${parseFloat(cartItem.productId.price).toFixed(2)}</span>
              </p>
              <p className="text-lg text-gray-800 my-2">
                <input
                  type="checkbox"
                  value={cartItem.productId._id}
                  onChange={(e) => handleCheckboxChange(e, cartItem.productId._id)}
                /> Select
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-indigo-700">Total Price: ${totalPrice.toFixed(2)}</h2>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={handlePurchase}>Purchase</button>
      </div>
    </div>
  );
}

export default MyCartData;















