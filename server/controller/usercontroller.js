const error_function = require('../utils/responsehandler').error_function
const success_function = require('../utils/responsehandler').success_function
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const users = require('../db/users')
  const products = require('../db/product')
const path = require('path');
const fs = require('fs');
const Cart = require('../db/cart')
const order = require('../db/order')
const wishlist = require('../db/wishlist')
const mongoose = require('mongoose');

exports.signup = async function (req, res) {

    try {
        const { name, email, password, confirmpassword, role } = req.body;
        console.log("req.body:",req.body);

        const userexist = await users.findOne({ email });
        console.log("userexist: ",userexist);
        if (userexist) {
            let response = error_function({
                statusCode: 400,
                message: 'User already exists'
            });
            return res.status(response.statusCode).send(response.message)
        } else {


            const salt = bcrypt.genSaltSync(10);
            console.log("salt: ",salt);
            const hashed_password = bcrypt.hashSync(password, salt);
            console.log("hashedpassword : ", hashed_password);

            const new_user = await users.create({
                name,
                email,
                role,
                password: hashed_password,
            });
            console.log("new_user:",new_user);

            if (new_user) {
                let response = success_function({
                    statusCode: 200,
                    message: "user created successfully"
                });
                return res.status(response.statusCode).send(response.message)
            } else {
                let response = error_function({
                    statusCode: 400,
                    message: 'user creation failed'
                });

                return res.status(res.statusCode).send(response.message)
            }


        }

    } catch (error) {
        let response = error_function({
            statusCode: 402,
            message: 'something went wrong'
        });
        return res.status(response.statusCode).send(response.message)
    }
}


exports.signin = async function (req, res) {


    try {

        let email = req.body.email;
        let password = req.body.password;


        const user = await users.findOne({ email });

        if (!user) {
            let response = error_function({
                statusCode: 401,
                message: "No user found"
            });
            res.status(response.statusCode).send(response.message);
        } else {
            let db_password = user.password;

            bcrypt.compare(password, db_password, (err, auth) => {
                if (auth === true) {
                    let access_token = jwt.sign({ user_id: user._id }, process.env.PRIVATE_KEY, { expiresIn: "1d" });
                    console.log("access_token : ", access_token);

                    let response = success_function({
                        statusCode: 200,
                        data: {
                            token: access_token,
                            role:user.role

                        },
                        message: "Login Successful",
                    });
                    res.status(response.statusCode).send(response);
                    return;
                } else {
                    let response = error_function({
                        statusCode: 401,
                        message: "Invalid credentials"
                    });
                    res.status(response.statusCode).send(response.message);
                    return;
                }
            });
        }
    } catch (error) {
        let response = error_function({
            statusCode: 402,
            message: "invalid email"
        });
        return res.status(response.statusCode).send(response.message);
    }
}

exports.seller = async function (req, res) {
    const { productName, price, tags, imageBase64, shippingMethod, sellerName, contactEmail,userId } = req.body;

    console.log(req.body)
    const Image = imageBase64.split(';base64,').pop();
    const binaryImage = Buffer.from(Image, 'base64');


    // Save the image to the server's file system

    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    const fileName = `${Date.now()}.png`;

    const relativePath = `/uploads/${fileName}`;


    // Write buffer to file
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, binaryImage);

    const new_product = await products.create({
        productName,
        price,
        tags,
        imageFile: relativePath,
        shippingMethod,
        sellerName,
        contactEmail,
        userId
    })

    if (new_product) {
        let response = success_function({
            statusCode: 200,
            message: "Product added Successfully"
        })
        return res.status(response.statusCode).send(response.message)
    } else {
        let response = error_function({
            statusCode: 400,
            message: "product adding failed"
        })
        return res.status(response.statusCode).send(response.message)
    }
    
    }  

    
exports.getuser = async function (req, res) {
    const userId = req.params.userId;
    try {
        // Fetch all products from the database
        const allProducts = await products.find(userId);

        if (allProducts && allProducts.length > 0) {
            // Sending success response with fetched products
            const response = {
                statusCode: 200,
                message: "Success",
                data: allProducts
            };
            res.status(200).json(response);
        } else {
            // Sending error response if no products found
            const response = {
                statusCode: 404,
                message: "No products found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        // Handling database or server errors
        console.error('Error fetching products:', error);
        const response = {
            statusCode: 500,
            message: "Internal Server Error"
        };
        res.status(500).send(response);
    }
}

exports.getproducts =async function(req,res){
    const userId = req.query.userId;

    try {
        // Fetch all products from the database
        const allProducts = await products.find({userId:userId});

        if (allProducts && allProducts.length > 0) {
            // Sending success response with fetched products
            const response = {
                statusCode: 200,
                message: "Success",
                data: allProducts
            };
            res.status(200).send(response);
        } else {
            // Sending error response if no products found
            const response = {
                statusCode: 404,
                message: "No products found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        // Handling database or server errors
        console.error('Error fetching products:', error);
        const response = {
            statusCode: 500,
            message: "Internal Server Error"
        };
        res.status(500).send(response);
    }
    
}


exports.productdetails=async function(req,res){
    try {
        const productId = req.params.productId;
        const product = await products.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        res.json(product);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.Updateproduct = async function (req, res) {


    const productId = req.params.productId;
    const productData = req.body;



    try {
        const updateproduct = await products.findByIdAndUpdate(productId, productData, { new: true });

        if (updateproduct) {
            // Sending response with updated user
            const response = {
                statusCode: 200,
                message: "User updated successfully",
                data: updateproduct
            };
            res.status(200).send(response);
        } else {
            // Sending error response if user not found
            const response = {
                statusCode: 404,
                message: "User not found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        console.error("Error updating user:", error);
        const response = {
            statusCode: 500,
            message: "Internal server error"
        };
        res.status(500).send(response);
    }
}

exports.deleteProduct = async function (req,res) {
    const productId = req.params.productId;

    try {
        // Attempt to find and delete the product by its ID
        const deletedProduct = await products.findByIdAndDelete(productId);

        if (deletedProduct) {
            // Sending response with deleted product information
            const response = {
                statusCode: 200,
                message: "Product deleted successfully",
                data: deletedProduct
            };
            res.status(200).send(response);
        } else {
            // Sending error response if product not found
            const response = {
                statusCode: 404,
                message: "Product not found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        const response = {
            statusCode: 500,
            message: "Internal server error"
        };
        res.status(500).send(response);
    }
}

exports.cartproducts = async function (req, res) {
    try {
        const productId = req.params.productId;
       
        const product = await products.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'User not found' });
        }


        res.json(product);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.reviews = async function (req, res) {
    const productId = req.params.productId;
    
    const { userName, rating, comment } = req.body;
    console.log(req.body);
    try {
        // Find the product by productId
        const product = await products.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Add the new review to the product's reviews array
        product.reviews.push({ userName, rating, comment });

        // Save the updated product document
        await product.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
}

exports.addcart = async function (req, res) {

    const { userId, productId } = req.body;
    // console.log("userId",userId);
    // console.log("productId",productId);
    try {
        // Check if the cart entry already exists for the given userId and productId
        const existingCartEntry = await Cart.findOne({ userId: userId, productId: productId });
        // console.log("existingCartEntry",existingCartEntry);
        if (existingCartEntry) {
            // If the cart entry already exists, return a message indicating that it's a duplicate
            return res.status(400).send("This product is already in the user's cart.");
        } else {
            // Create a new cart entry if it doesn't already exist
            const cartEntry = await Cart.create({
                userId: userId,
                productId: productId
            });
            // console.log("userId",userId);
            // console.log("productId",productId);

            if (cartEntry) {
                // Return success response if cart entry was created successfully
                return res.status(200).send("Cart item added successfully.");
            } else {
                // Return error response if cart entry creation failed
                return res.status(400).send("Failed to add item to cart.");
            }
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error adding item to cart:", error);
        return res.status(500).send("Something went wrong.");
    }


}

exports.mycart = async function (req, res) {


    const userId = req.query.userId; // Assuming userId is obtained from authenticated user
    console.log(userId)
    try {
        // Find all cart items for the specified user
        const cartItems = await Cart.find({ userId });
        console.log(cartItems)
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        // Array to store populated cart items
        const populatedCartItems = [];

        // Loop through each cart item to populate user and product details
        for (const cartItem of cartItems) {
            const user = await users.findById(cartItem.userId); // Fetch user details
            const product = await products.findById(cartItem.productId); // Fetch product details

            if (user && product) {
                // Construct a populated cart item object
                const populatedCartItem = {
                    userId: user,
                    productId: product,
                    quantity: cartItem.quantity
                };
                populatedCartItems.push(populatedCartItem);
            }
        }

        // Return populated cart items in the response
        return res.status(200).json(populatedCartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


exports.addorder = async function (req, res) {
    try {
        const { userId, productIds } = req.body;

        // Create new order
        await order.create({ userId, productId: productIds });

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.removefromcart = async function (req, res) {
    const { userId, productIds } = req.body;

    try {
        // Assuming userId is used to identify the user's cart
        // Delete cart items with the provided productIds
        await Cart.deleteMany({ userId: userId, productId: { $in: productIds } });

        res.status(200).json({ message: 'Selected products deleted successfully' });
    } catch (error) {
        console.error('Error deleting selected products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.myorder = async function (req, res) {
    const userId = req.query.userId;
    try {
        // Find all order items for the specified user
        const orderItems = await order.find({ userId });
        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        // Array to store populated order items
        const populatedOrderItems = [];

        // Loop through each order item to populate user and product details
        for (const orderItem of orderItems) {
            const user = await users.findById(orderItem.userId); // Fetch user details
            const product = await products.find({ _id: { $in: orderItem.productId } }); // Fetch product details

            if (user && product) {
                // Construct a populated order item object
                const populatedOrderItem = {
                    userId: user,
                    products: product,
                };
                populatedOrderItems.push(populatedOrderItem);
            }
        }
        // Return populated order items in the response
        return res.status(200).json(populatedOrderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.wishlist = async function (req, res) {
    const { userId, productId } = req.body;

    console.log(req.body)
    try {
        const existingwishlist = await wishlist.findOne({ userId: userId, productId: productId });

        if (existingwishlist) {
            return res.status(400).send("product already in wishlist")
        } else {
            const wishlistitem = await wishlist.create({
                userId: userId,
                productId: productId
            });
            if (wishlistitem) {
                // Return success response if cart entry was created successfully
                return res.status(200).send("added to wishlist  successfully.");
            } else {
                // Return error response if cart entry creation failed
                return res.status(400).send("Failed to add to wishlist.");
            }
        }
    } catch (error) {
        console.error("Error adding item to wishlist:", error);
        return res.status(500).send("Something went wrong.");
    }
}

exports.getwishlist = async function (req, res) {

    const userId = req.params.userId;
    console.log("userId", userId)

    try {
        const wishlistItems = await wishlist.find( userId ); // assuming you have a 'user' field in your Wishlist model
        console.log(wishlistItems);
         if (!wishlistItems || wishlistItems.length === 0) {
            return res.status(404).json({ message: 'no item  found on wishlist' });
        }

        // Array to store populated order items
        const populatedwishlistItems = [];

        // Loop through each order item to populate user and product details
        for (const wishlistItem of wishlistItems) {
            const user = await users.findById(wishlistItem.userId); 
            console.log(user)// Fetch user details
            const product = await products.find({ _id: { $in: wishlistItem.productId } }); // Fetch product details
console.log(product)
            if (user && product) {
                // Construct a populated order item object
                const populatedwishlistItem = {
                    userId: user,
                    products: product,
                };
                populatedwishlistItems.push(populatedwishlistItem);
            }
        }
        console.log("item",populatedwishlistItems)
        // Return populated order items in the response
        return res.status(200).json(populatedwishlistItems);
    } catch (error) {
res.status(500).send("something went wrong")
    }
}

exports.removeFromWishlist = async function (req, res) {
    const { userId, productId } = req.body;

    try {
        // Check if the wishlist item exists
        const existingWishlistItem = await wishlist.findOne({ userId: userId, productId: productId });

        if (!existingWishlistItem) {
            return res.status(404).send("Wishlist item not found.");
        }

        // If the wishlist item exists, remove it
        const deleteItem = await wishlist.deleteOne({
            userId: userId,
            productId: productId
        });

        if (deleteItem.deletedCount === 1) {
            return res.status(200).send("Item removed from wishlist.");
        } else {
            return res.status(500).send("Failed to remove item from wishlist.");
        }
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        return res.status(500).send("Something went wrong.");
    }
}

exports.purchaseCart = async function(req, res) {
    try {
        const { userId } = req.body;

        // Check if the required fields are provided
        if (!userId) {
            return res.status(400).json({ message: 'Missing user ID' });
        }

        // Fetch the user's cart items
        const cartItems = await Cart.find({ userId });

        // Check if the user has any items in the cart
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        // Calculate the total price of the items in the cart
        let totalPrice = 0;
        for (const cartItem of cartItems) {
            const product = await product.findById(cartItem.productId);
            totalPrice += product.price * cartItem.quantity;
        }

        // Implement the purchase logic (e.g., deduct balance, update inventory, etc.)
        // Here, we assume the purchase is successful, and we clear the user's cart
        await Cart.deleteMany({ userId });

        return res.status(200).json({ message: 'Purchase successful', totalPrice });
    } catch (error) {
        console.error('Error purchasing cart items:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};


// Mock user data (replace with your actual user data storage)
let loggedInUsers = [];


exports.signout = (req, res) => {
  const { token } = req.body;

  // Find the user by token and remove it from the list of logged-in users
  loggedInUsers = loggedInUsers.filter(user => user.token !== token);

  res.json({ message: 'Successfully signed out' });
};









