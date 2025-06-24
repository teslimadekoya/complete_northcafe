# Food Delivery App

A modern React-based food delivery application that connects to your food delivery API. This application provides a complete user experience for browsing meals, managing cart, placing orders, and tracking order history.

## Features

- 🔐 **Authentication**: User registration and login with JWT tokens
- 🍽️ **Menu Browsing**: Browse and search meals with category filtering
- 🛒 **Shopping Cart**: Add, update, and remove items from cart
- 📦 **Order Management**: Place orders with delivery options and gift details
- 📋 **Order History**: View and track order status
- 👤 **User Profile**: Manage account settings and preferences
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "frontend copy"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## API Configuration

The application is configured to connect to your food delivery API at:
```
https://backendtesting-production-dcfc.up.railway.app
```

### API Endpoints Used

- **Authentication**: `/api/auth/login/`, `/api/auth/registration/`, `/api/auth/token/refresh/`
- **Meals**: `/api/meals/`
- **Delivery**: `/api/delivery-types/`, `/api/locations/`
- **Cart**: `/api/cart/`
- **Orders**: `/api/orders/`

## Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar
│   └── ProtectedRoute.js # Route protection component
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state management
│   └── CartContext.js  # Shopping cart state management
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Menu.js         # Menu browsing page
│   ├── Cart.js         # Shopping cart page
│   ├── Checkout.js     # Order checkout page
│   ├── Orders.js       # Order history page
│   └── Profile.js      # User profile page
├── services/           # API service layer
│   └── api.js          # API configuration and methods
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Key Features Explained

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes for authenticated users
- Persistent login state

### Shopping Cart
- Real-time cart updates
- Quantity management
- Special instructions for meals
- Cart persistence across sessions

### Order Management
- Multiple delivery options
- Location-based delivery
- Gift order support
- Order tracking and history

### User Experience
- Responsive design for all devices
- Loading states and error handling
- Toast notifications for user feedback
- Smooth navigation and transitions

## Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the application for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Environment Variables

The application uses the following environment variables (if needed):

```env
REACT_APP_API_BASE_URL=https://backendtesting-production-dcfc.up.railway.app
```

## Deployment

To deploy the application:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service (Netlify, Vercel, AWS, etc.)

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure the API server is running
   - Check CORS configuration on the backend
   - Verify API endpoints are accessible

2. **Authentication Issues**
   - Clear browser localStorage
   - Check token expiration
   - Verify login credentials

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check if all dependencies are installed

### Development Tips

- Use browser developer tools to debug API calls
- Check the Network tab for failed requests
- Use React Developer Tools for state debugging
- Monitor console for error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please contact the development team or create an issue in the repository. 