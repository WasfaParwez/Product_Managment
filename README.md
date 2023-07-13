# Product_Managment
This project is a Product Management system that allows you to manage various features related to users, products, carts, and orders. It is designed to be developed feature-wise, where each feature is worked on individually and follows a set of steps.

The project is divided into four main features:

1. User Management:
   - Model: Defines the structure of the User object, including attributes such as name, email, profile image, address, etc.
   - APIs: Includes registration, login, profile retrieval, and profile update endpoints for users.
   - Token Handling: Specifies the use of JWT tokens for authentication, which should be sent in the Authorization header as a Bearer token.
   - Database: Requires the creation of a database group named "groupXDatabase" to store user-related data.

2. Product Management:
   - Model: Defines the structure of the Product object, including attributes such as title, description, price, image link, etc.
   - APIs: Includes endpoints for creating products, retrieving products with optional filters and sorting, updating products, and deleting products.
   - Image Handling: Requires uploading product images to an S3 bucket and saving the public URL in the product document.

3. Cart Management:
   - Model: Defines the structure of the Cart object, which tracks the items, total price, and total quantity for a user's cart.
   - APIs: Includes endpoints for adding products to the cart, removing/reducing product quantity, retrieving cart details, and deleting the cart.

4. Order Management:
   - Model: Defines the structure of the Order object, which represents a user's order with information about the items, total price, total items, total quantity, cancellable status, and order status.
   - APIs: Includes endpoints for creating an order, updating order status, and retrieving order details.

The project emphasizes the use of MongoDB as the database and AWS S3 for storing user profile images and product images. It also specifies the use of Git branching for team collaboration and outlines the response formats for successful and error responses for each API.

To set up the project, you need to follow the specified steps for each feature, create the necessary models, build the APIs, test them, and deploy them. The project encourages working on one feature at a time and repeating the steps for each feature.

By following this project structure, you can develop a comprehensive Product Management system with user authentication, product management, cart functionality, and order handling.

User APIs
POST /register
Create a user document from request body. Request body must contain image.
Upload image to S3 bucket and save it's public url in user document.
Save password in encrypted format. (use bcrypt)
Response format
On success - Return HTTP status 201. Also return the user document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
{
    "status": true,
    "message": "User created successfully",
    "data": {
        "fname": "John",
        "lname": "Doe",
        "email": "johndoe@mailinator.com",
        "profileImage": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/user/copernico-p_kICQCOM4s-unsplash.jpg",
        "phone": 9876543210,
        "password": "$2b$10$DpOSGb0B7cT0f6L95RnpWO2P/AtEoE6OF9diIiAEP7QrTMaV29Kmm",
        "address": {
            "shipping": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            },
            "billing": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            }
        },
        "_id": "6162876abdcb70afeeaf9cf5",
        "createdAt": "2021-10-10T06:25:46.051Z",
        "updatedAt": "2021-10-10T06:25:46.051Z",
        "__v": 0
    }
}
POST /login
Allow an user to login with their email and password.
On a successful login attempt return the userId and a JWT token contatining the userId, exp, iat.
NOTE: There is a slight change in response body. You should also return userId in addition to the JWT token.

Response format
On success - Return HTTP status 200 and JWT token in response body. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
{
    "status": true,
    "message": "User login successfull",
    "data": {
        "userId": "6165f29cfe83625cf2c10a5c",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyODc2YWJkY2I3MGFmZWVhZjljZjUiLCJpYXQiOjE2MzM4NDczNzYsImV4cCI6MTYzMzg4MzM3Nn0.PgcBPLLg4J01Hyin-zR6BCk7JHBY-RpuWMG_oIK7aV8"
    }
}
GET /user/:userId/profile (Authentication required)
Allow an user to fetch details of their profile.
Make sure that userId in url param and in token is same
Response format
On success - Return HTTP status 200 and returns the user document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
{
    "status": true,
    "message": "User profile details",
    "data": {
        "address": {
            "shipping": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            },
            "billing": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            }
        },
        "_id": "6162876abdcb70afeeaf9cf5",
        "fname": "John",
        "lname": "Doe",
        "email": "johndoe@mailinator.com",
        "profileImage": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/user/copernico-p_kICQCOM4s-unsplash.jpg",
        "phone": 9876543210,
        "password": "$2b$10$DpOSGb0B7cT0f6L95RnpWO2P/AtEoE6OF9diIiAEP7QrTMaV29Kmm",
        "createdAt": "2021-10-10T06:25:46.051Z",
        "updatedAt": "2021-10-10T06:25:46.051Z",
        "__v": 0
    }
}
PUT /user/:userId/profile (Authentication and Authorization required)
Allow an user to update their profile.
A user can update all the fields
Make sure that userId in url param and in token is same
Response format
On success - Return HTTP status 200. Also return the updated user document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
{
    "status": true,
    "message": "User profile updated",
    "data": {
        "address": {
            "shipping": {
                "street": "MG Road",
                "city": "Delhi",
                "pincode": 110001
            },
            "billing": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452010
            }
        },
        "_id": "6162876abdcb70afeeaf9cf5",
        "fname": "Jane",
        "lname": "Austin",
        "email": "janedoe@mailinator.com",
        "profileImage": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/user/laura-davidson-QBAH4IldaZY-unsplash.jpg",
        "phone": 9876543210,
        "password": "$2b$10$jgF/j/clYBq.3uly6Tijce4GEGJn9EIXEcw9NI3prgKwJ/6.sWT6O",
        "createdAt": "2021-10-10T06:25:46.051Z",
        "updatedAt": "2021-10-10T08:47:15.297Z",
        "__v": 0
    }
}
Note: Bcrypt Send form-data

FEATTURE II - Product
Models
Product Model
{ 
  title: {string, mandatory, unique},
  description: {string, mandatory},
  price: {number, mandatory, valid number/decimal},
  currencyId: {string, mandatory, INR},
  currencyFormat: {string, mandatory, Rupee symbol},
  isFreeShipping: {boolean, default: false},
  productImage: {string, mandatory},  // s3 link
  style: {string},
  availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
  installments: {number},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}
Products API (No authentication required)
POST /products
Create a product document from request body.
Upload product image to S3 bucket and save image public url in document.
Response format
On success - Return HTTP status 201. Also return the product document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
GET /products
Returns all products in the collection that aren't deleted.
Filters
Size (The key for this filter will be 'size')
Product name (The key for this filter will be 'name'). You should return all the products with name containing the substring recieved in this filter
Price : greater than or less than a specific value. The keys are 'priceGreaterThan' and 'priceLessThan'.
NOTE: For price filter request could contain both or any one of the keys. For example the query in the request could look like { priceGreaterThan: 500, priceLessThan: 2000 } or just { priceLessThan: 1000 } )

Sort
Sorted by product price in ascending or descending. The key value pair will look like {priceSort : 1} or {priceSort : -1} eg /products?size=XL&name=Nit%20grit
Response format
On success - Return HTTP status 200. Also return the product documents. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
GET /products/:productId
Returns product details by product id
Response format
On success - Return HTTP status 200. Also return the product documents. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
PUT /products/:productId
Updates a product by changing at least one or all fields
Check if the productId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like this
Response format
On success - Return HTTP status 200. Also return the updated product document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
DELETE /products/:productId
Deletes a product by product id if it's not already deleted
Response format
On success - Return HTTP status 200. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
FEATURE III - Cart
Models
Cart Model
{
  userId: {ObjectId, refs to User, mandatory, unique},
  items: [{
    productId: {ObjectId, refs to Product model, mandatory},
    quantity: {number, mandatory, min 1}
  }],
  totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
  totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}
Cart APIs (authentication required as authorization header - bearer token)
POST /users/:userId/cart (Add to cart)
Create a cart for the user if it does not exist. Else add product(s) in cart.
Get cart id in request body.
Get productId in request body.
Make sure that cart exist.
Add a product(s) for a user in the cart.
Make sure the userId in params and in JWT token match.
Make sure the user exist
Make sure the product(s) are valid and not deleted.
Get product(s) details in response body.
Response format
On success - Return HTTP status 201. Also return the cart document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
PUT /users/:userId/cart (Remove product / Reduce a product's quantity from the cart)
Updates a cart by either decrementing the quantity of a product by 1 or deleting a product from the cart.
Get cart id in request body.
Get productId in request body.
Get key 'removeProduct' in request body.
Make sure that cart exist.
Key 'removeProduct' denotes whether a product is to be removed({removeProduct: 0}) or its quantity has to be decremented by 1({removeProduct: 1}).
Make sure the userId in params and in JWT token match.
Make sure the user exist
Get product(s) details in response body.
Check if the productId exists and is not deleted before updating the cart.
Response format
On success - Return HTTP status 200. Also return the updated cart document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
GET /users/:userId/cart
Returns cart summary of the user.
Make sure that cart exist.
Make sure the userId in params and in JWT token match.
Make sure the user exist
Get product(s) details in response body.
Response format
On success - Return HTTP status 200. Return the cart document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
DELETE /users/:userId/cart
Deletes the cart for the user.
Make sure that cart exist.
Make sure the userId in params and in JWT token match.
Make sure the user exist
cart deleting means array of items is empty, totalItems is 0, totalPrice is 0.
Response format
On success - Return HTTP status 204. Return a suitable message. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
FEATURE IV - Order
Models
Order Model
{
  userId: {ObjectId, refs to User, mandatory},
  items: [{
    productId: {ObjectId, refs to Product model, mandatory},
    quantity: {number, mandatory, min 1}
  }],
  totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
  totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
  totalQuantity: {number, mandatory, comment: "Holds total number of quantity in the cart"},
  cancellable: {boolean, default: true},
  status: {string, default: 'pending', enum[pending, completed, cancled]},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}
Checkout/Order APIs (Authentication and authorization required)
POST /users/:userId/orders
Create an order for the user
Make sure the userId in params and in JWT token match.
Make sure the user exist
Get cart details in the request body
Response format
On success - Return HTTP status 200. Also return the order document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
PUT /users/:userId/orders
Updates an order status
Make sure the userId in params and in JWT token match.
Make sure the user exist
Get order id in request body
Make sure the order belongs to the user
Make sure that only a cancellable order could be canceled. Else send an appropriate error message and response.
Response format
On success - Return HTTP status 200. Also return the updated order document. The response should be a JSON object like this
On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
Testing
To test these apis create a new collection in Postman named Project 5 Shopping Cart
