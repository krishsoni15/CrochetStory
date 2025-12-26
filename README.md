# 🧶 CrochetStory - Handcrafted Crochet Products Website

A beautiful, production-ready e-commerce website for handcrafted crochet products built with Next.js 14, MongoDB, and Cloudinary. Features seamless WhatsApp integration for order placement and a comprehensive admin panel for product management.

## ✨ Features

### 🎨 Public Features
- **Beautiful Homepage**: Animated hero section with product showcase
- **Product Catalog**: Browse all handcrafted crochet products
- **Product Details**: Detailed view with image slider and full product information
- **Category Filtering**: Filter products by category (Home Decor, Hair Accessories, Gift Articles, Others)
- **Sorting Options**: Sort by latest, price (low to high, high to low)
- **WhatsApp Order Integration**: One-click order placement via WhatsApp
- **Responsive Design**: Fully responsive, works on all devices
- **Smooth Animations**: Beautiful animations using Framer Motion and GSAP

### 🔐 Admin Features
- **Secure Authentication**: JWT-based authentication with 30-day sessions
- **Admin Dashboard**: Comprehensive dashboard with product statistics
- **Product Management**: 
  - Add new products with multiple images
  - Edit existing products
  - Delete products with confirmation
- **Image Upload**: Cloudinary integration for image storage
- **Product Statistics**: View total products, products by category, total images, average price
- **Product Gallery**: Visual gallery of all product images
- **Password Management**: Change admin password securely

### 📱 WhatsApp Integration
- **Order Placement**: Customers can place orders directly via WhatsApp
- **Auto-filled Forms**: Customer information saved in localStorage for convenience
- **Order Messages**: Formatted order messages with product details, customer info, and timestamp
- **Business Contact**: Direct WhatsApp link to business number (6355369640)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or cloud)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CrochetStory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/crochetstory
   JWT_SECRET=your-strong-secret-key-minimum-32-characters
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Initialize admin account**
   ```bash
   node scripts/init-admin.mjs [username] [password]
   ```
   
   Example:
   ```bash
   node scripts/init-admin.mjs admin Admin@123
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
CrochetStory/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin pages
│   │   ├── dashboard/           # Admin dashboard
│   │   └── login/               # Admin login
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── products/            # Product CRUD endpoints
│   │   └── upload/              # Image upload endpoint
│   ├── products/                # Products page
│   ├── layout.js                # Root layout
│   ├── page.js                  # Homepage
│   └── globals.css              # Global styles
├── components/                  # React components
│   ├── Navbar.js                # Navigation bar
│   ├── Footer.js                # Footer component
│   ├── ProductCardShop.js       # Product card for shop
│   ├── ProductDetailModal.js    # Product detail modal
│   ├── OrderForm.js             # WhatsApp order form
│   ├── Admin components         # Admin-specific components
│   └── UI components            # Reusable UI components
├── hooks/                       # Custom React hooks
│   ├── useAdminAuth.js          # Admin authentication hook
│   ├── useMicroRewards.js       # Micro-interaction rewards
│   └── ...                      # Other hooks
├── lib/                         # Utility libraries
│   ├── auth.js                  # JWT authentication
│   ├── db.js                    # MongoDB connection
│   ├── cloudinary.js            # Cloudinary configuration
│   └── motion.js                # Animation configurations
├── models/                      # MongoDB models
│   ├── Admin.js                 # Admin model
│   └── Product.js               # Product model
├── public/                      # Static assets
│   └── images/                  # Product images
├── scripts/                     # Utility scripts
│   ├── init-admin.mjs           # Initialize admin account
│   ├── reset-admin.mjs          # Reset admin account
│   └── change-admin-password.mjs # Change admin password
├── middleware.js                # Next.js middleware
├── next.config.js               # Next.js configuration
└── package.json                # Dependencies
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Utilities
npm run lint         # Run ESLint
```

## 📱 WhatsApp Order Integration

### How It Works

1. **Customer clicks "Order Now"** on any product
2. **Order form opens** with fields for:
   - Customer name
   - WhatsApp number
3. **Information is saved** to localStorage for future orders
4. **WhatsApp opens** with pre-filled order message containing:
   - Product name, category, price, description
   - Product image URL
   - Customer name and WhatsApp number
   - Order date and time
   - Website URL

### Order Message Format

```
NEW ORDER REQUEST

Hello! I would like to place an order for a handcrafted crochet product.

PRODUCT DETAILS
Product Name: [Product Name]
Category: [Category]
Price: ₹[Price]
Description: [Description]
Product Image: [Image URL]

CUSTOMER INFORMATION
Name: [Customer Name]
WhatsApp Number: +91 [Phone Number]

ORDER DATE & TIME
Date: [Date and Time]

WEBSITE
Visit us at: http://crochet.in/

MESSAGE
Please confirm my order and let me know the next steps.

Thank you so much!
```

### Business Phone Number

The WhatsApp business number is configured in:
- `components/OrderForm.js` - `BUSINESS_PHONE = '6355369640'`
- `components/ProductCardShop.js` - `BUSINESS_PHONE = '6355369640'`
- `components/ProductDetailModal.js` - `BUSINESS_PHONE = '6355369640'`

To change the business number, update the `BUSINESS_PHONE` constant in these files.

## 🔐 Admin Panel

### Accessing Admin Panel

1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to `/admin/dashboard` upon successful login

### Admin Features

#### Dashboard Overview
- **Total Products**: Count of all products
- **Products by Category**: Breakdown by category
- **Total Images**: Total number of product images
- **Average Price**: Average product price
- **Total Value**: Sum of all product prices
- **Product Gallery**: Visual gallery of product images

#### Product Management
- **Add Product**: 
  - Product name (required, min 3 characters)
  - Description (required, min 10 characters)
  - Price (required, must be > 0)
  - Category (Home Decor, Hair Accessories, Gift Articles, Others)
  - Images (required, multiple images supported, max 50MB each)

- **Edit Product**: 
  - Modify any product details
  - Add more images to existing products
  - Remove images

- **Delete Product**: 
  - Confirmation modal before deletion
  - Immediate UI update

#### Authentication
- **30-Day Sessions**: Admin stays logged in for 30 days
- **Secure Cookies**: HttpOnly, Secure (in production), SameSite=Lax
- **JWT Tokens**: Secure token-based authentication
- **Auto Logout**: Automatic logout on token expiration

### Admin Scripts

#### Initialize Admin Account
```bash
node scripts/init-admin.mjs [username] [password]
```

#### Reset Admin Account
```bash
node scripts/reset-admin.mjs [username] [password]
```

#### Change Admin Password
```bash
node scripts/change-admin-password.mjs [username] [new-password]
# Or find first admin and change password:
node scripts/change-admin-password.mjs [new-password]
```

## 🗄️ Database Models

### Admin Model
```javascript
{
  username: String (required, unique),
  passwordHash: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (required),
  images: [String] (required, array of Cloudinary URLs),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds (10)
- **HttpOnly Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS only in production
- **CSRF Protection**: SameSite cookie attribute
- **Input Validation**: Server-side and client-side validation
- **Environment Variables**: Sensitive data in environment variables
- **No Fallback Secrets**: Required environment variables throw errors if missing

## 🎨 Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Icons**: Custom SVG icons
- **Smooth Scroll**: Lenis

## 📦 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/change-password` - Change admin password

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (admin only)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Upload
- `POST /api/upload` - Upload images to Cloudinary (admin only)

## 🌐 Deployment

See [PRODUCTION.md](./PRODUCTION.md) for detailed production deployment guide.

### Quick Deployment Checklist
- [ ] Set all environment variables
- [ ] Build the project (`npm run build`)
- [ ] Test production server (`npm start`)
- [ ] Initialize admin account
- [ ] Verify MongoDB connection
- [ ] Verify Cloudinary credentials
- [ ] Test all features

## 📝 License

This project is private and proprietary.

## 👤 Support

For support, contact via WhatsApp: +91 6355369640

---

**Made with ❤️ and lots of yarn**
