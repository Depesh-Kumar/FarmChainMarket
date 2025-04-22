import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema,
  insertOrderSchema, 
  insertOrderItemSchema,
  insertReviewSchema
} from "@shared/schema";
import { createHash } from 'crypto';
import session from "express-session";
import MemoryStore from "memorystore";

// Helper for hashing passwords
const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "farmchain_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };
  
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash the password
      const hashedPassword = hashPassword(userData.password);
      
      // Create user
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userResponse } = newUser;
      
      res.status(201).json(userResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Register error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const hashedPassword = hashPassword(password);
      if (hashedPassword !== user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      req.session.userId = user.id;
      req.session.userType = user.userType;
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      
      res.status(200).json({ message: "Login successful", user: userResponse });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logout successful" });
    });
  });
  
  app.get("/api/auth/me", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userResponse } = user;
      
      res.status(200).json(userResponse);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/users/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      
      // Don't allow updating username, email or password this way
      const { username, email, password, userType, ...updateData } = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: _, ...userResponse } = updatedUser;
      
      res.status(200).json(userResponse);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Category routes
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
      const farmerId = req.query.farmerId ? Number(req.query.farmerId) : undefined;
      
      let products;
      if (categoryId) {
        products = await storage.getProductsByCategory(categoryId);
      } else if (farmerId) {
        products = await storage.getProductsByFarmer(farmerId);
      } else {
        products = await storage.getProducts();
      }
      
      res.status(200).json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const userType = req.session.userType as string;
      
      // Only farmers can create products
      if (userType !== "farmer") {
        return res.status(403).json({ message: "Only farmers can create products" });
      }
      
      const productData = insertProductSchema.parse({
        ...req.body,
        farmerId: userId
      });
      
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const userId = req.session.userId as number;
      
      // Get the product to check ownership
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if the user is the owner of the product
      if (product.farmerId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this product" });
      }
      
      // Don't allow changing the farmerId
      const { farmerId, ...updateData } = req.body;
      
      const updatedProduct = await storage.updateProduct(productId, updateData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const userId = req.session.userId as number;
      
      // Get the product to check ownership
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if the user is the owner of the product
      if (product.farmerId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this product" });
      }
      
      await storage.deleteProduct(productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Order routes
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const userType = req.session.userType as string;
      
      let orders;
      if (userType === "buyer") {
        // Buyers see their own orders
        orders = await storage.getOrdersByBuyer(userId);
      } else if (userType === "farmer") {
        // Farmers see orders that include their products
        orders = await storage.getOrdersForFarmer(userId);
      } else {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.status(200).json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      const userId = req.session.userId as number;
      const userType = req.session.userType as string;
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Buyers can only see their own orders
      if (userType === "buyer" && order.buyerId !== userId) {
        return res.status(403).json({ message: "Not authorized to view this order" });
      }
      
      // Farmers can only see orders that include their products
      if (userType === "farmer") {
        const farmerOrders = await storage.getOrdersForFarmer(userId);
        if (!farmerOrders.some(o => o.id === orderId)) {
          return res.status(403).json({ message: "Not authorized to view this order" });
        }
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(orderId);
      
      res.status(200).json({ order, items: orderItems });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const userType = req.session.userType as string;
      
      // Only buyers can create orders
      if (userType !== "buyer") {
        return res.status(403).json({ message: "Only buyers can create orders" });
      }
      
      const { order, items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order must include items" });
      }
      
      // Validate order data
      const orderData = insertOrderSchema.parse({
        ...order,
        buyerId: userId
      });
      
      // Validate each item and calculate total
      let totalAmount = 0;
      const validatedItems = [];
      
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        
        if (!product) {
          return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
        }
        
        if (!product.inStock || product.availableQuantity < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough quantity available for product ${product.name}` 
          });
        }
        
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        validatedItems.push({
          productId: product.id,
          quantity: item.quantity,
          pricePerUnit: product.price,
          total: itemTotal
        });
      }
      
      // Create order with the calculated total
      const newOrder = await storage.createOrder(
        { ...orderData, totalAmount },
        validatedItems
      );
      
      res.status(201).json({
        order: newOrder,
        items: await storage.getOrderItems(newOrder.id)
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/orders/:id/status", isAuthenticated, async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const userId = req.session.userId as number;
      const userType = req.session.userType as string;
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Buyers can only cancel their own orders
      if (userType === "buyer") {
        if (order.buyerId !== userId) {
          return res.status(403).json({ message: "Not authorized to update this order" });
        }
        
        // Buyers can only cancel orders
        if (status !== 'cancelled') {
          return res.status(403).json({ message: "Buyers can only cancel orders" });
        }
      }
      
      // Farmers can update status of orders that include their products
      if (userType === "farmer") {
        const farmerOrders = await storage.getOrdersForFarmer(userId);
        if (!farmerOrders.some(o => o.id === orderId)) {
          return res.status(403).json({ message: "Not authorized to update this order" });
        }
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const reviews = await storage.getReviews(productId);
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/products/:id/reviews", isAuthenticated, async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const userId = req.session.userId as number;
      
      // Validate the product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Parse and validate review data
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId
      });
      
      const newReview = await storage.createReview(reviewData);
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create review error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
