import React, { useState } from 'react';

const BuyerPage = () => {
  const [products, setProducts] = useState([
    //  { id: 1, name: 'Product 1', price: 10.99, description: 'Description of Product 1', image: 'https://via.placeholder.com/150' },
    // { id: 2, name: 'Product 2', price: 19.99, description: 'Description of Product 2', image: 'https://via.placeholder.com/150' },
    // { id: 3, name: 'Product 3', price: 29.99, description: 'Description of Product 3', image: 'https://via.placeholder.com/150' },
  ]);

  const handleBuyProduct = (productId) => {
    // Placeholder function for buying a product
    console.log(`Buying product with id: ${productId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Buyer Page</h1>

        {/* Product Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <img src={product.image} alt={product.name} className="mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => handleBuyProduct(product.id)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerPage;
