# Delivery Management Dashboard API
This is a RESTful API for managing deliveries in a dashboard application. It provides various endpoints for handling orders, managing delivery partners, tracking assignments, and retrieving important metrics related to deliveries and partners.
Table of Contents
1.	Getting Started
2.	API Documentation
   
      Dashboard

       Partners

      Orders

      Assignments

4.	Future Improvements
5.	License
________________________________________
Getting Started

### Prerequisites

To run this API locally, ensure you have the following installed:

•	Node.js

•	Express

### Installation

1.	Clone the Repository:
   
`
git clone https://github.com/KhushiTiwarii/delivery_mgmt.git
`

`
cd delivery-management-dashboard-api
`

2.	Install Dependencies:

`
npm install
`

3.	Set Up Environment Variables: Create a .env file in the root directory to store environment-specific variables (e.g., database connection strings, ports, API keys). A sample .env.example is provided.
   
4.	Run the API:

`
npm run dev
`

The API will start running at http://localhost:3000 (or the port specified in your .env file).

## Testing

To test the endpoints, use a tool like Postman or curl. The base URL for the API is:

`
http://localhost:3000/api
`

### API Documentation

Refer to the API Documentation for details on each endpoint. Below is a summary of the main endpoints.
#### Dashboard

	GET  /dashboard - Retrieves dashboard metrics, including active orders, partner status, and recent assignments.
 
#### Partners

	GET /partners - Retrieves all delivery partners.

	POST /partners - Creates a new delivery partner.

	PUT /partners/:id - Updates an existing partner.

	DELETE /partners/:id - Deletes a partner.

	GET /partners/metrics - Retrieves partner metrics, such as average rating and top delivery areas.

#### Orders

	GET /orders - Retrieves all orders, with optional filters for status, area, and date.

	POST /orders/assign - Assigns an order to an available delivery partner.

	PUT /orders/:id/status - Updates an order’s status.

	GET /orders/:id - Retrieves details of a specific order.

#### Assignments

	GET /assignments - Retrieves active assignments, metrics, and partner availability.

	GET /assignments/metrics - Retrieves metrics related to order assignments.
 
	POST /assignments/run - Runs the assignment process for pending orders.

