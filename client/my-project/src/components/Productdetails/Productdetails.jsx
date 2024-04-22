import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EditProduct() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3100/getproduct/${productId}`);
                setProduct(response.data); // Assuming response.data contains product details
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Error fetching product. Please try again later.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            // Perform API request to update product in the database
            const response = await axios.put(`http://localhost:3100/updateproduct/${productId}`, product);
            console.log('Product updated successfully:', response.data);
            // Exit edit mode after saving
            setEditMode(false);
        } catch (error) {
            console.error('Error updating product:', error);
            // Handle error updating product
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    if (loading) {
        return <p className="text-gray-600">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
            {product && (
                <div className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
                    <div className="p-4">
                        {/* Image Section */}
                        <div className="mb-4">
                            <img
                                src={`http://localhost:3100${product.imageFile}`}
                                alt={product.productName}
                                className="w-full h-64 object-contain rounded-lg shadow-md"
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        {/* Details Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="productName"
                                        value={product.productName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    product.productName
                                )}
                            </h3>
                            <p className="text-gray-600 mb-2">
                                Price:{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    `$${product.price}`
                                )}
                            </p>
                            <p className="text-gray-600 mb-2">
                                Tags:{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="tags"
                                        value={product.tags}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    product.tags
                                )}
                            </p>
                            <p className="text-gray-600 mb-2">
                                Shipping Method:{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="shippingMethod"
                                        value={product.shippingMethod}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    product.shippingMethod
                                )}
                            </p>
                            <p className="text-gray-600 mb-2">
                                Seller Name:{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="sellerName"
                                        value={product.sellerName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    product.sellerName
                                )}
                            </p>
                            <p className="text-gray-600 mb-2">
                                Contact Email:{" "}
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="contactEmail"
                                        value={product.contactEmail}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    product.contactEmail
                                )}
                            </p>
                            {editMode && (
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                                >
                                    Save
                                </button>
                            )}
                            <button
                                onClick={handleEdit}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {editMode ? "Cancel" : "Edit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditProduct;
