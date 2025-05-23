# Automated Coffee System - Backend

This is the backend server for an automated coffee system, built with Express.js, TypeScript, and MongoDB.

## Features

- User management and history tracking
- Machine monitoring and inventory management
- Ingredient management
- Recipe management with category classification
- Order processing
- Warning system for machine issues

## Prerequisites

- Node.js (v14+)
- MongoDB

## Change Streams Support

This application uses MongoDB Change Streams for real-time updates. Change streams are only supported in:

1. MongoDB deployments running as a replica set
2. MongoDB deployments running as a sharded cluster

For development, you have two options:

### Option 1: Use the Polling Fallback (Default)

The application automatically falls back to polling when change streams aren't available.

### Option 2: Enable Replica Set for Development

To enable full change stream functionality locally:

1. Start MongoDB as a replica set:

```bash
# Create data directory if it doesn't exist
mkdir -p ./mongo-data

# Start MongoDB with replica set enabled
mongod --dbpath ./mongo-data --replSet rs0
```

2. Initialize the replica set (one-time setup):

```bash
# Connect to MongoDB shell
mongosh

# Inside the mongo shell
rs.initiate()
exit
```

3. Update your .env file to include the replica set name:
```
MONGODB_URI=mongodb://localhost:27017/coffee_db?replicaSet=rs0
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get a single user
- `POST /api/users` - Create a new user
- `PUT /api/users/:userId` - Update a user
- `DELETE /api/users/:userId` - Delete a user
- `GET /api/users/:userId/history` - Get user history

### Machines
- `GET /api/machines` - Get all machines
- `GET /api/machines/:machineId` - Get a single machine
- `POST /api/machines` - Create a new machine
- `PUT /api/machines/:machineId` - Update a machine
- `DELETE /api/machines/:machineId` - Delete a machine
- `GET /api/machines/:machineId/inventory` - Get machine inventory
- `PUT /api/machines/:machineId/inventory` - Update machine inventory

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/:ingredientId` - Get a single ingredient
- `POST /api/ingredients` - Create a new ingredient
- `PUT /api/ingredients/:ingredientId` - Update an ingredient
- `DELETE /api/ingredients/:ingredientId` - Delete an ingredient

### Recipes
- `GET /api/recipes/categories` - Get all recipe categories
- `POST /api/recipes/categories` - Create a new recipe category
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:recipeId` - Get a single recipe
- `POST /api/recipes` - Create a new recipe
- `PUT /api/recipes/:recipeId` - Update a recipe
- `DELETE /api/recipes/:recipeId` - Delete a recipe

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get a single order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:orderId/status` - Update order status
- `PUT /api/orders/:orderId/rate` - Rate an order

### Warnings
- `GET /api/warnings` - Get all warnings
- `GET /api/warnings/:warningId` - Get a single warning
- `POST /api/warnings` - Create a new warning
- `PUT /api/warnings/:warningId/resolve` - Resolve a warning
- `DELETE /api/warnings/:warningId` - Delete a warning

## Database Schema

The system uses the following data models:

- **User**: Stores customer and admin information
- **UserHistory**: Tracks user actions
- **Machine**: Stores coffee machine details and status
- **Ingredient**: Catalogs available ingredients
- **MachineIngredientInventory**: Tracks inventory levels at each machine
- **RecipeCategory**: Categorizes recipes
- **Recipe**: Stores recipe details including nutritional information
- **RecipeIngredient**: Maps ingredients to recipes with quantities
- **Order**: Tracks customer orders
- **Warning**: Tracks machine warnings and errors 