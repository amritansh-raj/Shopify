Project Title: Shopify - Grocery Store Frontend Web Application

Description:

Overview:
The Grocery Store Frontend Web Application is a responsive and user-friendly interface for customers to browse and purchase products from a grocery store. This web application interacts with a Django backend server on the same network to retrieve product information and facilitate user authentication. Additionally, it provides an admin interface for store managers to manage categories and products securely.

Key Features:

1. User Authentication:

Customers and store managers can log in securely using Django authentication.
User sessions are managed using cookies for a seamless experience.

2. Product Display:

The application retrieves product information from the Django backend server via HTTP requests.
Products are categorized for easy navigation.
Each product listing includes details such as name, price, description, and an option to add it to the cart.

2. Shopping Cart:

Normal users can add products to their shopping cart.
The cart displays the added items with quantities and a total cost.
Users can update the cart, remove items, or proceed to checkout.

3. Admin Panel:

Store managers have access to an admin panel.
Managers can log in using their credentials and Django authentication.
Admin functionalities include adding new categories and products securely.

4. Security:

The application ensures secure communication with the Django backend server using HTTPS protocols.
Proper HTTP methods (GET, POST, PUT, DELETE) are used for various operations.
HTTP status codes are implemented to handle requests and responses effectively.

5. Responsive Design:

The frontend is designed using HTML, CSS, and Bootstrap to provide a responsive and visually appealing user interface.
It adjusts seamlessly to different screen sizes and devices.

6. Error Handling:

Proper error handling is implemented to notify users of any issues, such as failed logins or unsuccessful transactions.

7. Technology Stack:

Frontend:

HTML, CSS for layout and styling
Bootstrap for responsive design
AngularJS for dynamic frontend interactions

Backend:

Django for handling user authentication, managing categories, and products
Postman for testing APIs

Development Steps:

1. Design the frontend layout, incorporating Bootstrap and AngularJS for dynamic elements.

2. Implement user authentication using Django's authentication system.

3. Set up HTTP endpoints on the Django backend for retrieving product information, managing user sessions, and handling admin operations.

4. Design the user interface for browsing products, adding items to the cart, and managing the cart.

5. Create an admin panel with login functionality for store managers and implement the ability to add categories and products.

6. Implement HTTPS for secure communication between the frontend and backend.

7. Implement proper HTTP methods and status codes for CRUD operations and error handling.

8. Test the application thoroughly to ensure functionality, security, and responsiveness.

9. Deploy the application on a local network for users to access.
