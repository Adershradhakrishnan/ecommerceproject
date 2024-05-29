import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const fetchCartItems = async () => {
  try {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      console.error("Access token not found in localStorage");
      return;
    }

    const payloadBase64 = accessToken.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    const decodedToken = JSON.parse(decodedPayload);
    const userId = decodedToken.user_id;

    const response = await axios.get('http://localhost:3100/mycart', {
      params: { userId: userId }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
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
  }, []);

  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handlePurchase = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
      }

      const payloadBase64 = accessToken.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const decodedToken = JSON.parse(decodedPayload);
      const userId = decodedToken.user_id;

      await axios.post('http://localhost:3100/order/add', {
        userId: userId,
        productIds: selectedProducts
      });

      await axios.delete('http://localhost:3100/mycart/delete', {
        data: { userId: userId, productIds: selectedProducts }
      });

      Swal.fire({
        icon: 'success',
        title: 'Purchase Successful',
        text: 'Your item has been shipped and will be delivered within 2 to 3 working days.',
      }).then((result) => {
        if (result.isConfirmed) {
          setSelectedProducts([]);
          setTotalPrice(0);

          fetchCartItems()
            .then(data => setCartItems(data))
            .catch(error => console.error(error));
        }
      });
    } catch (error) {
      console.error("Error purchasing items:", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete('http://localhost:3100/cartproduct/delete', {
        data: { productIds: selectedProducts }
      });

      // Remove the deleted items from the cartItems state
      setCartItems(prevCartItems => prevCartItems.filter(cartItem => !selectedProducts.includes(cartItem.productId._id)));

      Swal.fire({
        icon: 'success',
        title: 'Product Deleted',
        text: 'The selected product has been removed from your cart.',
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">My Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((cartItem) => (
          <div key={cartItem._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src={`http://localhost:3100${cartItem.productId.imageFile}`}
              className="w-full h-64 object-contain p-4"
              alt={cartItem.productId.productName}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-blue-600">{cartItem.productId.productName}</h3>
              <p className="text-lg text-gray-800 mt-2">
                <strong>Price:</strong> <span className="text-green-600">Rs.{parseFloat(cartItem.productId.price).toFixed(2)}</span>
              </p>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  value={cartItem.productId._id}
                  onChange={(e) => handleCheckboxChange(e, cartItem.productId._id)}
                  className="mr-2"
                /> 
                <span className="text-gray-700">Select</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <h2 className="text-3xl font-bold text-blue-600">Total Price: Rs.{totalPrice.toFixed(2)}</h2>
        <div className="mt-4">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full mr-4" onClick={handlePurchase}>
            Purchase
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full" onClick={handleDeleteProduct}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyCartData;
