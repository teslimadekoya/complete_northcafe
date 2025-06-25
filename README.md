# North Café - Food Delivery App

A modern, responsive food delivery application built with React, featuring user authentication, cart management, and a beautiful UI.

## Features

- 🍽️ **Menu Display** - Browse delicious meals with detailed descriptions
- 🛒 **Shopping Cart** - Add items, manage quantities, and checkout
- 👤 **User Authentication** - Sign up, login, and profile management
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS
- 🔒 **Protected Routes** - Secure checkout and profile pages
- 📋 **Order Management** - Track your orders and history

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/teslimadekoya/complete_northcafe.git
cd complete_northcafe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Deployment

### Deploy to Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables** (if needed):
   - Add any environment variables in the Vercel dashboard

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The build folder is ready to be deployed to any static hosting service.

## Project Structure

```
├── components/          # Reusable React components
├── pages/              # Page components
├── context/            # React Context providers
├── services/           # API services
├── public/             # Static assets
├── App.js              # Main App component
├── index.js            # Entry point
└── package.json        # Dependencies and scripts
```

## API Configuration

The app is configured to work with a backend API. The API base URL is set in `services/api.js`. For production deployment, make sure to update the API endpoint if needed.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@northcafe.com or create an issue in this repository. 