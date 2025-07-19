# 🍳 Digital Recipe Book

A modern, full-featured recipe management application built with React, Firebase, and Tailwind CSS. Store, organize, and plan your favorite recipes with a beautiful, responsive interface.

## ✨ Features

### 🔐 Authentication
- **User Registration & Login** - Secure authentication with Firebase Auth
- **Profile Management** - Update profile information and upload profile photos
- **Persistent Sessions** - Stay logged in across browser sessions

### 📚 Recipe Management
- **Add New Recipes** - Create recipes with images, ingredients, and instructions
- **View All Recipes** - Browse your personal recipe collection
- **Public Recipe Gallery** - Discover recipes from other users
- **Recipe Details** - View complete recipe information with step-by-step instructions
- **Search & Filter** - Find recipes quickly with search functionality

### 🗓️ Meal Planning
- **Create Meal Plans** - Plan your meals by date
- **Recipe Selection** - Choose from your saved recipes for meal plans
- **Date-based Organization** - Organize meals by specific dates

### 📊 Dashboard
- **Personal Overview** - Welcome message with user's name
- **Recipe Statistics** - View total number of recipes created
- **Meal Plan Summary** - See upcoming meal plans
- **Quick Actions** - Easy navigation to key features

### 🎨 User Interface
- **Modern Design** - Clean, responsive interface with Tailwind CSS
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Orange Theme** - Consistent orange color scheme throughout the app
- **Mobile Responsive** - Works perfectly on all device sizes

### 🖼️ Image Management
- **Cloudinary Integration** - Upload and store recipe images
- **Profile Photos** - Upload and manage profile pictures
- **Image Optimization** - Automatic image optimization and storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-recipe-book
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   ```

4. **Firebase Setup**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Set up security rules for Firestore

5. **Cloudinary Setup**
   - Create a Cloudinary account
   - Get your cloud name and upload preset
   - Configure upload preset settings

6. **Run the application**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
digital-recipe-book/
├── src/
│   ├── app/
│   │   └── store.js                 # Redux store configuration
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation component
│   │   ├── Button.jsx              # Reusable button component
│   │   ├── Card.jsx                # Reusable card component
│   │   ├── FormInput.jsx           # Reusable form input component
│   │   ├── RecipeCard.jsx          # Recipe card component
│   │   ├── LoadingSpinner.jsx      # Loading spinner component
│   │   ├── EmptyState.jsx          # Empty state component
│   │   └── PageContainer.jsx       # Page layout container
│   ├── context/
│   │   └── ThemeContext.jsx        # Theme context for dark/light mode
│   ├── feature/
│   │   └── auth/
│   │       ├── authSlice.js        # Redux auth slice
│   │       └── authThunk.js        # Redux auth thunks
│   ├── firebase/
│   │   └── config.js               # Firebase configuration
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── LoginPage.jsx           # Login page
│   │   ├── SignupPage.jsx          # Registration page
│   │   ├── DashboardPage.jsx       # User dashboard
│   │   ├── ProfilePage.jsx         # User profile management
│   │   ├── AddRecipePage.jsx       # Add new recipe
│   │   ├── ViewAllRecipesPage.jsx  # User's private recipes
│   │   ├── RecipesPage.jsx         # Public recipes gallery
│   │   ├── RecipeDetailPage.jsx    # Individual recipe view
│   │   └── MealPlanPage.jsx        # Meal planning
│   ├── utils/
│   │   └── useCloudinaryUpload.js  # Cloudinary upload hook
│   ├── App.jsx                     # Main app component
│   └── main.jsx                    # App entry point
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
└── vite.config.js                  # Vite configuration
```

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Image Storage**: Cloudinary
- **Routing**: React Router DOM
- **Icons**: React Icons

## 📱 Key Features in Detail

### Authentication Flow
- Secure user registration and login
- Profile photo upload with Cloudinary
- Persistent authentication state
- Protected routes for authenticated users

### Recipe Management
- **Add Recipes**: Upload images, add ingredients, and write step-by-step instructions
- **Private Recipes**: View only your own recipes in the private section
- **Public Recipes**: Browse and discover recipes from all users
- **Recipe Details**: Complete recipe view with all information

### Meal Planning
- Create meal plans for specific dates
- Select from your saved recipes
- View upcoming meal plans on dashboard
- Persistent meal plan data

### Dashboard Analytics
- Welcome message with user's name
- Recipe count statistics
- Meal plan overview
- Quick navigation to key features

## 🎨 Theme & Styling

The application uses a consistent orange theme throughout:
- **Primary Color**: Orange (`text-orange-600`, `bg-orange-600`)
- **Secondary Elements**: Rounded buttons and cards
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel, Netlify, Firebase Hosting, etc.

3. **Configure environment variables** on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the Firebase console for any configuration issues
2. Verify your environment variables are correctly set
3. Ensure all dependencies are installed
4. Check the browser console for any errors

---

**Built with ❤️ using React, Firebase, and Tailwind CSS**
