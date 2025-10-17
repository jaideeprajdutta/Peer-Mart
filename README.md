# College Marketplace - Trading & Selling Platform

A comprehensive college-based marketplace where students can buy, sell, and trade items with coins system and college-specific listings.

## Features

### 🎓 College-Based System
- Users select their college during registration
- Products are filtered by college
- Option to trade with other colleges
- College-specific marketplace

### 💰 Coins System
- Users start with 100 coins
- Earn coins by:
  - Listing products (50 coins)
  - Completing trades (100 coins bonus)
- Spend coins to purchase items
- Use coins in trade negotiations

### 🔄 Trading System
- Propose trades with items + coins
- Accept/reject trade proposals
- Trade history tracking
- Real-time trade notifications

### 📱 Personal Product Management
- View all your listings in one place
- Edit product details and pricing
- Mark products as sold
- Delete unwanted listings
- Track listing performance

### 💬 Real-Time Chat System
- Direct messaging between users
- Contact sellers instantly
- Socket.IO powered real-time communication
- Chat history and message persistence
- Product inquiry integration

### 📱 Product Management
- Upload multiple product images
- Detailed product descriptions
- Category-based filtering
- Condition tracking (New, Like New, Good, Fair, Poor)
- Search functionality

### 🛡️ Authentication & Security
- Secure user registration with college selection
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **React Dropzone** - File uploads
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-marketplace
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Setup MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Make sure MongoDB is running on `mongodb://localhost:27017`
   - The database `cdsc` will be created automatically

5. **Seed Initial Data**
   ```bash
   cd server
   node seedData.js
   cd ..
   ```

6. **Environment Variables (Optional)**
   Create `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cdsc
   JWT_SECRET=your-secret-key-here
   ```

### Running the Application

#### Option 1: Using the batch script (Windows)
```bash
start.bat
```

#### Option 2: Manual startup

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Usage Guide

### Getting Started
1. **Sign Up**: Create an account and select your college
2. **Browse**: Explore products from your college
3. **List Items**: Upload products with images and details
4. **Trade**: Propose trades with other students
5. **Buy**: Purchase items using coins

### Trading Process
1. Find an item marked "TRADE"
2. Click "Trade" button
3. Select your items and/or coins to offer
4. Add a message (optional)
5. Send proposal
6. Wait for response from the other user

### Earning Coins
- **Initial Signup**: 100 coins
- **List a Product**: +50 coins
- **Complete a Trade**: +100 coins (both parties)

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/signin` - User login

### Colleges
- `GET /api/colleges` - Get all colleges

### Products
- `GET /api/products` - Get products (with filters)
- `POST /api/products` - Create new product (with image upload)

### Trading
- `GET /api/trades` - Get user's trades
- `POST /api/trades` - Create trade proposal
- `PUT /api/trades/:id` - Accept/reject trade

### Purchases
- `POST /api/purchase` - Buy a product

## File Structure

```
college-marketplace/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SignIn.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── SellProduct.jsx
│   │   ├── TradingHub.jsx
│   │   └── TradeModal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── MarketplaceContext.jsx
│   ├── App.jsx
│   └── index.jsx
├── server/
│   ├── uploads/ (created automatically)
│   ├── index.js
│   ├── seedData.js
│   └── package.json
├── package.json
├── start.bat
└── README.md
```

## Features in Detail

### College System
- 10 pre-seeded colleges (MIT, Stanford, Harvard, etc.)
- Users can only see products from their college by default
- Option to enable cross-college trading

### Image Upload
- Support for JPEG, PNG, GIF formats
- Maximum 5 images per product
- 5MB file size limit
- Images stored in `server/uploads/`

### Trade Proposals
- Multi-item trades supported
- Coin additions to balance trade value
- Message system for negotiations
- Status tracking (pending, accepted, rejected, completed)

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the repository.