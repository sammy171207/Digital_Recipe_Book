import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageContainer, Button, Card } from '../components';

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  const features = [
    {
      icon: '🍳',
      title: 'Create & Share Recipes',
      description: 'Build your personal recipe collection with detailed instructions, ingredients, and photos.'
    },
    {
      icon: '📅',
      title: 'Meal Planning',
      description: 'Plan your weekly meals in advance and never wonder what to cook again.'
    },
    {
      icon: '🛒',
      title: 'Grocery Lists',
      description: 'Automatically generate shopping lists from your meal plans and recipes.'
    },
    {
      icon: '👥',
      title: 'Community Recipes',
      description: 'Discover delicious recipes from other home cooks in our community.'
    },
    {
      icon: '📱',
      title: 'Access Anywhere',
      description: 'Your recipes are synced across all your devices, accessible anytime.'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find recipes quickly with our powerful search and filter options.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Home Cook',
      content: 'This app has completely changed how I organize my recipes. I love being able to plan my meals for the week!',
      avatar: '👩‍🍳'
    },
    {
      name: 'Mike Chen',
      role: 'Food Blogger',
      content: 'The community features are amazing. I\'ve discovered so many new recipes from other passionate cooks.',
      avatar: '👨‍🍳'
    },
    {
      name: 'Emma Davis',
      role: 'Busy Parent',
      content: 'Meal planning has never been easier. I save so much time and money with this app!',
      avatar: '👩‍👧‍👦'
    }
  ];

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="text-center py-16 md:py-20 px-2 sm:px-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Your Digital Recipe Book
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Organize your favorite recipes, plan your meals, and discover new dishes from our community of home cooks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/recipes'}>
                Browse Recipes
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" onClick={() => window.location.href = '/signup'}>
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-16 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">Everything you need to organize your kitchen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-12 md:py-16 bg-white rounded-2xl my-10 md:my-16 px-2 sm:px-0">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">How it works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started in just a few simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Create Account</h3>
            <p className="text-gray-600">Sign up for free and start building your recipe collection</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Add Recipes</h3>
            <p className="text-gray-600">Upload your favorite recipes with photos and detailed instructions</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Plan & Cook</h3>
            <p className="text-gray-600">Plan your meals, generate shopping lists, and enjoy cooking</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 md:py-16 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 dark:text-white">What our users say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center">
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-16 text-center px-2 sm:px-0">
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white dark:from-orange-600 dark:to-red-700">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Join thousands of home cooks who are already organizing their recipes with us.
          </p>
          {user ? (
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-orange-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/add-recipe'}
            >
              Add Your First Recipe
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-orange-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/signup'}
            >
              Start Cooking Today
            </Button>
          )}
        </Card>
      </div>

      {/* Footer */}
      <div className="py-6 md:py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 text-sm">
        <p>&copy; 2024 Digital Recipe Book. Made with ❤️ for home cooks everywhere.</p>
      </div>
    </PageContainer>
  );
};

export default Home;