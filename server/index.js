import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cdsc', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Schemas
const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  coins: { type: Number, default: 100 },
  canTradeOutside: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'] },
  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  isAvailable: { type: Boolean, default: true },
  isForTrade: { type: Boolean, default: false },
  tradePreferences: [{ type: String }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const tradeSchema = new mongoose.Schema({
  proposer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposerItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  receiverItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  proposerCoins: { type: Number, default: 0 },
  receiverCoins: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['purchase', 'trade'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'trade_proposal', 'product_inquiry'], default: 'text' },
  relatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  relatedTrade: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Models
const College = mongoose.model('College', collegeSchema);
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Trade = mongoose.model('Trade', tradeSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);

// Auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get fresh user data from database
    const user = await User.findById(decoded.userId).populate('college');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name,
      collegeId: user.college._id,
      coins: user.coins
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async (userId) => {
    try {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Update user online status in database
      await User.findByIdAndUpdate(userId, { 
        isOnline: true, 
        lastSeen: new Date() 
      });
      
      console.log(`User ${userId} joined with socket ${socket.id}`);
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
  });

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { chatId, content, messageType, relatedProduct, relatedTrade } = data;
      
      const message = new Message({
        chat: chatId,
        sender: socket.userId,
        content,
        messageType: messageType || 'text',
        relatedProduct,
        relatedTrade
      });

      await message.save();
      await message.populate('sender', 'name');

      // Update chat's last message and activity
      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
        lastActivity: new Date()
      });

      // Send message to all users in the chat
      io.to(chatId).emit('receive_message', {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        messageType: message.messageType,
        relatedProduct: message.relatedProduct,
        relatedTrade: message.relatedTrade,
        createdAt: message.createdAt
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', async () => {
    if (socket.userId) {
      try {
        connectedUsers.delete(socket.userId);
        
        // Update user offline status in database
        await User.findByIdAndUpdate(socket.userId, { 
          isOnline: false, 
          lastSeen: new Date() 
        });
        
        console.log(`User ${socket.userId} disconnected`);
      } catch (error) {
        console.error('Error updating user offline status:', error);
      }
    }
  });
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

// College Routes
app.get('/api/colleges', async (req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authentication Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, collegeId, canTradeOutside } = req.body;

    // Validate input
    if (!email || !password || !name || !collegeId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Verify college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(400).json({ message: 'Invalid college selected' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      college: collegeId,
      canTradeOutside: canTradeOutside || false
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and populate college
    const user = await User.findOne({ email }).populate('college');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, collegeId: user.college._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        college: user.college,
        coins: user.coins,
        canTradeOutside: user.canTradeOutside
      }
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { college, category, search } = req.query;
    let query = { isAvailable: true };

    if (college) {
      query.college = college;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .populate('college', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, category, condition, isForTrade, tradePreferences } = req.body;
    
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = new Product({
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      images,
      seller: req.user.userId,
      college: req.user.collegeId,
      isForTrade: isForTrade === 'true',
      tradePreferences: tradePreferences ? JSON.parse(tradePreferences) : []
    });

    await product.save();
    
    // Award coins for listing
    await User.findByIdAndUpdate(req.user.userId, { $inc: { coins: 50 } });

    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'name email')
      .populate('college', 'name');

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User's own products
app.get('/api/my-products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.userId })
      .populate('college', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
app.put('/api/products/:id', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const { title, description, price, category, condition, isForTrade, tradePreferences, isAvailable } = req.body;
    
    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (typeof isForTrade !== 'undefined') product.isForTrade = isForTrade === 'true';
    if (typeof isAvailable !== 'undefined') product.isAvailable = isAvailable === 'true';
    if (tradePreferences) product.tradePreferences = JSON.parse(tradePreferences);

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    product.updatedAt = new Date();
    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('seller', 'name email')
      .populate('college', 'name');

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark product as sold
app.put('/api/products/:id/mark-sold', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.isAvailable = false;
    product.updatedAt = new Date();
    await product.save();

    res.json({ message: 'Product marked as sold' });
  } catch (error) {
    console.error('Error marking product as sold:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trade Routes
app.get('/api/trades', authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.find({
      $or: [
        { proposer: req.user.userId },
        { receiver: req.user.userId }
      ]
    })
    .populate('proposer', 'name email')
    .populate('receiver', 'name email')
    .populate('proposerItems')
    .populate('receiverItems')
    .sort({ createdAt: -1 });

    res.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/trades', authenticateToken, async (req, res) => {
  try {
    const { receiverId, proposerItems, receiverItems, proposerCoins, receiverCoins, message } = req.body;

    const trade = new Trade({
      proposer: req.user.userId,
      receiver: receiverId,
      proposerItems: proposerItems || [],
      receiverItems: receiverItems || [],
      proposerCoins: proposerCoins || 0,
      receiverCoins: receiverCoins || 0,
      message
    });

    await trade.save();

    const populatedTrade = await Trade.findById(trade._id)
      .populate('proposer', 'name email')
      .populate('receiver', 'name email')
      .populate('proposerItems')
      .populate('receiverItems');

    res.status(201).json(populatedTrade);
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/trades/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (trade.receiver.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    trade.status = status;
    trade.updatedAt = new Date();

    if (status === 'accepted') {
      // Handle coin transfers and item ownership changes
      if (trade.proposerCoins > 0) {
        await User.findByIdAndUpdate(trade.proposer, { $inc: { coins: -trade.proposerCoins } });
        await User.findByIdAndUpdate(trade.receiver, { $inc: { coins: trade.proposerCoins } });
      }
      if (trade.receiverCoins > 0) {
        await User.findByIdAndUpdate(trade.receiver, { $inc: { coins: -trade.receiverCoins } });
        await User.findByIdAndUpdate(trade.proposer, { $inc: { coins: trade.receiverCoins } });
      }

      // Mark items as unavailable
      if (trade.proposerItems.length > 0) {
        await Product.updateMany(
          { _id: { $in: trade.proposerItems } },
          { isAvailable: false, updatedAt: new Date() }
        );
      }
      if (trade.receiverItems.length > 0) {
        await Product.updateMany(
          { _id: { $in: trade.receiverItems } },
          { isAvailable: false, updatedAt: new Date() }
        );
      }

      // Award completion bonus
      await User.findByIdAndUpdate(trade.proposer, { $inc: { coins: 100 } });
      await User.findByIdAndUpdate(trade.receiver, { $inc: { coins: 100 } });
    }

    await trade.save();

    const populatedTrade = await Trade.findById(trade._id)
      .populate('proposer', 'name email')
      .populate('receiver', 'name email')
      .populate('proposerItems')
      .populate('receiverItems');

    res.json(populatedTrade);
  } catch (error) {
    console.error('Error updating trade:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase Routes
app.post('/api/purchase', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId).populate('seller');
    if (!product || !product.isAvailable) {
      return res.status(404).json({ message: 'Product not available' });
    }

    const buyer = await User.findById(req.user.userId);
    if (buyer.coins < product.price) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Process transaction
    buyer.coins -= product.price;
    await buyer.save();

    const seller = await User.findById(product.seller._id);
    seller.coins += product.price;
    await seller.save();

    product.isAvailable = false;
    product.updatedAt = new Date();
    await product.save();

    // Record transaction
    const transaction = new Transaction({
      buyer: buyer._id,
      seller: seller._id,
      product: product._id,
      amount: product.price,
      type: 'purchase'
    });
    await transaction.save();

    res.json({ message: 'Purchase successful', transaction });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Chat Routes
app.get('/api/chats', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.userId
    })
    .populate('participants', 'name email')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    })
    .sort({ lastActivity: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get or create chat between two users
app.post('/api/chats', authenticateToken, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user.userId, otherUserId] }
    }).populate('participants', 'name email');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.user.userId, otherUserId]
      });
      await chat.save();
      await chat.populate('participants', 'name email');
    }

    res.json(chat);
  } catch (error) {
    console.error('Error creating/fetching chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a chat
app.get('/api/chats/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant in this chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name')
      .populate('relatedProduct', 'title images price')
      .populate('relatedTrade')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      { 
        chat: chatId, 
        sender: { $ne: req.user.userId },
        isRead: false 
      },
      { isRead: true }
    );

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User profile route
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('college')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});