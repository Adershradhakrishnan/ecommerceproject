const error_function = require('../utils/responsehandler').error_function
const success_function = require('../utils/responsehandler').success_function
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const users = require('../db/users')
  const products = require('../db/product')
const path = require('path');
const fs = require('fs');


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
    const { productName, price, tags, imageBase64, shippingMethod, sellerName, contactEmail } = req.body;

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
        contactEmail
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

    try {
        // Fetch all products from the database
        const allProducts = await products.find();

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


    try {
        // Fetch all products from the database
        const allProducts = await products.find();

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
