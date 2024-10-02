# MyEcommerce

**MyEcommerce** is a powerful, fully customizable eCommerce platform built from the ground up to provide an intuitive and efficient online shopping experience. Designed with both customers and administrators in mind, the platform offers a seamless, multi-language interface, secure payment integrations, and a comprehensive set of administrative tools for managing products, orders, and user behavior. With its robust architecture and advanced dashboard, **MyEcommerce** is ideal for businesses looking for flexibility, scalability, and complete control over their eCommerce operations.

The platform is built on the **MERN stack (MongoDB, Express.js, React, Node.js)**, with **Material-UI (MUI)** providing a responsive and modern user interface, and **JWT** ensuring secure user authentication. Additionally, it integrates with popular payment gateways like **PayPal** and **Stripe**, offering a streamlined checkout process for customers. 

---

![01  Homepage](https://github.com/user-attachments/assets/73a4f829-b5f1-459a-b05a-4da928ea0097)


## Technologies

### Frontend:
- **React**: for building a dynamic and interactive user interface
- **Material-UI (MUI)**: for UI components and layout
- **Axios**: for handling API requests to the backend

### Backend:
- **Node.js**: server-side JavaScript runtime
- **Express.js**: web application framework
- **MongoDB**: NoSQL database for flexible and scalable data storage
- **Mongoose**: object modeling for MongoDB
- **JWT (JSON Web Tokens)**: for secure user authentication and session management

## Features

### 1. User Registration and Authentication
**MyEcommerce** offers a complete user authentication system, allowing customers to create accounts, log in, and manage their sessions securely.
- **Account creation**: Users can easily create an account by providing their email address and a password. Passwords are securely hashed before being stored, ensuring user data protection.
- **Login/Logout**: Secure login functionality, enabling users to access their personalized accounts. Upon logout, all session data is cleared, ensuring privacy and security.
- **Password recovery**: Users who forget their password can request a password reset link, which is sent to their registered email address. They can then reset their password securely.
  
![03  Login](https://github.com/user-attachments/assets/212e8bc2-bc9e-448c-b900-0e9f2e30caee)

![04  Forgot Password](https://github.com/user-attachments/assets/8f2a72ac-93ba-40e3-b3c0-8c21ecbd6762)

![05  Welcome page](https://github.com/user-attachments/assets/cf892324-c900-4ad8-b507-b62747692057)


### 2. Product Catalog
The product catalog is designed to display a comprehensive range of products, allowing customers to easily browse and find what they need.
- **Product list view**: All products are displayed in a visually appealing grid, complete with high-quality images, prices, and a quick view of stock availability.
- 
![06  Product Catalog](https://github.com/user-attachments/assets/ac2faad7-221c-4ca8-be1b-2a7a56ce2d94)


- **Product detail view**: Clicking on a product provides an in-depth view of the item, with full descriptions, multiple images, pricing details, and real-time stock availability.

![10  Product Details](https://github.com/user-attachments/assets/f0132645-bd40-43bd-ac46-431d2d84ceea)


- **Categories and filters**: Customers can search products by categories, and further narrow down their search using custom filters (e.g., price range, product rating, brand, etc.).

![07  Search Products](https://github.com/user-attachments/assets/f2351394-f77d-4e39-b525-e90672af1ba0)

![08  Filtering](https://github.com/user-attachments/assets/12243485-26f2-414d-a7e5-cb8fda1f66fa)

![09  Ordering](https://github.com/user-attachments/assets/27cb3cdb-3816-46a5-baee-ad74913c92e4)


### 3. Shopping Cart
The shopping cart provides a seamless experience for adding and managing products before proceeding to checkout.
- **Add/Remove products**: Customers can add products to the cart with a single click and remove them just as easily.
- **View cart**: The cart page displays a complete list of added products, including images, prices, and quantity. Users can update product quantities or remove items as needed.
- **Total calculation**: The total price is dynamically calculated, including applicable taxes and shipping fees, giving users a clear breakdown of their order cost.

![11  Shopping Cart](https://github.com/user-attachments/assets/d04d10fa-202b-4986-b7c3-f902524a40c5)


### 4. Checkout and Payments
The checkout process is designed for ease of use and security, integrating multiple payment gateways for user convenience.
- **Shipping information**: Customers can enter their shipping details at checkout, with the option to select from pre-saved addresses stored in their profile.

![12  Shipping Details](https://github.com/user-attachments/assets/e6378d83-def6-4720-b97a-a032a2aaba60)


- **Payment method selection**: Users can choose their preferred payment method, whether it’s a credit card, PayPal, or another payment service.

![13  Payment Method](https://github.com/user-attachments/assets/ad3a19a3-33c1-4a25-b7fe-3817dc0263f0)


- **Payment gateways**: The platform integrates with **PayPal** and **Stripe**, ensuring secure, real-time transactions. Customers can save multiple payment methods and select them during checkout for quicker processing.

![14  Review and payment](https://github.com/user-attachments/assets/1de315d0-75bd-4fcf-8472-364b85b76bb6)

![15  PayPal payment](https://github.com/user-attachments/assets/087bf2b1-6212-4e72-903e-11ec22adf9a8)


### 5. Order Management
The platform provides users with tools to manage their orders and track the status of their purchases.
- **Order creation and confirmation**: Orders are created once the payment is successfully processed, and users receive an email confirmation with details of the transaction.

![16  Success](https://github.com/user-attachments/assets/6a6dfced-7b0d-46e0-b2a6-9d1ad7b473e5)


- **Order history**: A complete order history is available in the user's profile, allowing customers to view previous purchases, order details, and invoices.

![17  Orders history](https://github.com/user-attachments/assets/824e1025-4f59-4fb7-9d4a-958bed46857f)


- **Order status**: Real-time tracking of the order's progress (e.g., "Processing," "Shipped," "Delivered"), keeping customers informed throughout the fulfillment process.

![18  Orders Status](https://github.com/user-attachments/assets/b565da3d-02c3-43b4-a1ce-7a8c6e7b7d4f)


### 6. User Profile
Each user has a profile where they can manage their personal details, addresses, and payment methods.
- **View and edit profile**: Users can update their personal information (name, email, password) and manage account security settings.

![19  User Profile](https://github.com/user-attachments/assets/d2a383c9-0584-4681-9a8a-9b5acc57546f)


- **Manage addresses**: The profile section includes a dedicated area for managing multiple shipping addresses, allowing users to set default addresses for faster checkouts.

![20  Manage Shipping Addresses](https://github.com/user-attachments/assets/fee19d2a-37bc-4edb-bfc0-3c3ee3de863f)


- **Manage payment methods**: Users can securely store multiple payment methods in their profile for easy selection during checkout.

![21  Manage Payment Methods](https://github.com/user-attachments/assets/119b9530-4554-44f9-94e0-e6c6f4effe52)


### 7. Product Management (Admin)
Administrators have full control over the product catalog and can manage inventory, product listings, and categories through an intuitive admin panel.
- **Add, edit, and delete products**: Admins can easily add new products, update existing product details, or remove items from the catalog.

![22  Add Product](https://github.com/user-attachments/assets/ba953d01-1c1e-48ca-aeaf-a88035222399)

![23  Edit Product](https://github.com/user-attachments/assets/e14501cc-c85b-4732-9dbd-5350274d5c99)

![24  Edit Product 2](https://github.com/user-attachments/assets/9acc1ddd-6eb2-4351-9a8c-f994d3605d50)


- **Inventory management**: Real-time inventory tracking ensures that stock levels are always up to date, allowing admins to prevent overselling.

- **Category management**: Create, edit, and organize product categories to ensure customers can find what they’re looking for quickly.

![25  Manage Categories](https://github.com/user-attachments/assets/96b4f2a4-a604-43a0-b87c-428349e9c242)


### 8. Product Reviews and Ratings
**MyEcommerce** allows customers to leave feedback on products they’ve purchased, ensuring transparency and enhancing the shopping experience.
- **Leave reviews**: Only customers who have purchased and received a product can leave reviews, ensuring authentic feedback.

![27  Add Review 2](https://github.com/user-attachments/assets/f0398e7a-8cc7-46dd-a8d8-9213cc1ee42b)


- **Average ratings**: The platform calculates the average rating of each product based on customer reviews, displaying a star rating on product pages.

![28  Add Review 3](https://github.com/user-attachments/assets/9f06a1c9-ca40-4100-946e-aa98a10b2f97)


### 9. Wishlist
Customers can create and manage wishlists, allowing them to save products for future purchases.
- **Create wishlists**: Users can easily add products to one or more personalized wishlists.
- **Add/Remove products**: Customers can add products to their wishlists from product detail pages and remove them as desired.

![29  Wishlist 1](https://github.com/user-attachments/assets/bff046a0-ab39-405a-aa3f-5c57b050ce74)

![30  Wishlist 2](https://github.com/user-attachments/assets/0177a2ff-f6d3-463b-baa2-08a62d21470d)

![31  Wishlist 3](https://github.com/user-attachments/assets/db542846-9d0c-4db8-82a1-0288c5bd1af8)


### 10. Advanced Admin Dashboard
The admin panel offers powerful tools for tracking sales performance and user interactions.
- **Sales statistics and reports**: Generate detailed reports on product sales, revenue trends, top-selling items, and overall financial performance.

![32  Sales Report](https://github.com/user-attachments/assets/e6e7a0d3-860f-4bd6-a7a0-9eb7856b2fc7)


- **User behavior analysis**: Monitor how users interact with the platform, track metrics such as page views, cart abandonment, and time spent on product pages. This data can be used to optimize the user experience and improve sales conversion rates.

![33  User Behaviour](https://github.com/user-attachments/assets/43c1c54b-5636-4bad-bcfd-7dbe7e074d03)


### 11. Multi-language Support
The platform is fully equipped to handle multiple languages, making it suitable for international markets.
- **Language selection**: Users can toggle between supported languages (e.g., English and Italian) directly from the interface.

![34  Multi Language 1](https://github.com/user-attachments/assets/93679ce0-6a01-42d3-b9cc-db0286ff7f6c)


- **Translation management**: Every text element in the user interface is dynamically translated according to the selected language, offering a seamless multilingual experience.

![35  Multi Language 2](https://github.com/user-attachments/assets/66703cf5-15b0-4eab-949b-21436664f94d)



---


## Getting Started

To run **MyEcommerce** locally, follow these steps:

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-repo/my-ecommerce.git

2. Install the dependencies:
   ```bash
   cd my-ecommerce
   npm install

3. Start the backend:
   ```bash
   cd server
   npm start

4. Start the frontend:
   ```bash
   cd client
   npm run dev

## Contributing
We welcome contributions! Feel free to submit issues or pull requests to improve the platform.

## License
This project is licensed under the MIT License. 



