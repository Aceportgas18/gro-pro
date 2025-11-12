# eGrocery - Complete E-Grocery Web Application

A full-stack e-commerce grocery application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### Customer Side
- 🏠 Responsive home page with grocery categories
- 🔍 Product listing with search, filter, and sort
- 📱 Product detail pages with add-to-cart functionality
- 🛒 Shopping cart and checkout flow
- 🔐 JWT-based authentication (login/signup)

### Admin Side
- 🔒 Secure admin authentication
- 📊 Dashboard with sales, orders, and stock overview
- ✏️ CRUD operations for products
- 📦 Automatic stock deduction on orders
- ⚠️ Low-stock alerts (threshold < 10)
- 🔄 Manual restock functionality

### Backend Features
- 🚀 RESTful Express.js API
- 🗄️ MongoDB with proper data validation
- 🛡️ Role-based authentication middleware
- ⚙️ Environment-based configuration

### Frontend Features
- ⚛️ React with modern hooks
- 🎨 Tailwind CSS for responsive design
- 🧭 React Router for navigation
- 📡 Axios for API communication
- 🧩 Reusable component architecture

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd eGrocery
   npm install
   npm run install-all
   ```

2. **Environment Setup**
   ```bash
   cp .env.sample .env
   # Edit .env with your configuration (see Environment Variables section below)
   ```

3. **MongoDB Setup**
   - **Local MongoDB**: Install MongoDB Community Server and start it
   - **MongoDB Atlas**: Create a free cluster and get connection string
   - Update `MONGODB_URI` in your `.env` file

4. **Start Development Servers**
   ```bash
   # Start both client and server concurrently
   npm run dev

   # Or start them separately:
   # Terminal 1 - Start the server
   npm run server

   # Terminal 2 - Start the client
   npm run client
   ```

5. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

### Access the Application
- **Client**: http://localhost:3000
- **Server API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
eGrocery/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Database & app config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── package.json         # Root package.json
├── .env.sample         # Environment template
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/admin` - Get all orders (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/egrocery
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/egrocery

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Admin Credentials (used for seeding database)
ADMIN_EMAIL=admin@egrocery.com
ADMIN_PASSWORD=Admin123
```

## Admin Credentials

After seeding the database, you can log in as admin using:

- **Email**: admin@egrocery.com
- **Password**: Admin123

*Note: These credentials are configurable via environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`*

## Technologies Used

- **Frontend**: React, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Development**: Concurrently, Nodemon

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License...