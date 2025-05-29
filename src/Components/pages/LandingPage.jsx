import React from 'react';
import { BookOpen, Search, Heart, Coffee, BookMarked, ChevronRight } from 'lucide-react';
import PersonReading from '../../Images/Person-reading.jpg'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <div className="min-h-screen mx-4  bg-gradient-to-b from-teal-50 to-white font-sans">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 ">
        <div className="flex justify-between px-4 py-4 items-center rounded-full bg-gray-300">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-teal-600" />
            <span className="ml-2 text-2xl font-bold text-teal-800">NavTok</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="font-semibold text-gray-700 hover:text-teal-600 transition">Home</a>
            <a href="#" className="font-semibold text-gray-700 hover:text-teal-600 transition">About</a>
            <a href="#books" className="font-semibold text-gray-700 hover:text-teal-600 transition">Books</a>
            <a href="#" className="font-semibold text-gray-700 hover:text-teal-600 transition">Categories</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-2 py-1 font-semibold text-teal-600 hover:text-teal-900 transition" onClick={() => navigate('/auth')}>Sign In</button>
            <span className="text-gray-700 text-bold">|</span>
            <button className="px-2 py-1 font-semibold  text-teal-600 hover:text-teal-900 transition" onClick={() => navigate('/auth')}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto h-[90vh] px-8 py-12 md:py-18 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
            Discover a World of Stories at Your Fingertips
          </h1>
          <p className="text-lg text-gray-600 mb-8 md:mb-12">
            Access thousands of books and novels. Read anywhere, anytime, on any device. Start your reading journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition flex items-center" onClick={() => navigate('/auth')}>
              Get Started <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button className="px-6 py-3 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition" onClick={() => navigate('/auth')}>
              Explore Library
            </button>
          </div>
        </div>
        <div className="md:ml-[10vw] md:w-1/2">
          <img
            src={PersonReading} 
            alt="Person reading on a tablet"
            className="rounded-lg shadow-xl fit h-[40vh] w-auto object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Readers Love Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-teal-50 rounded-lg">
              <div className="p-4 bg-teal-100 rounded-full inline-block mb-4">
                <BookMarked className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Vast Collection</h3>
              <p className="text-gray-600">
                Access thousands of books across all genres, from classics to the latest bestsellers.
              </p>
            </div>
            <div className="p-6 bg-teal-50 rounded-lg">
              <div className="p-4 bg-teal-100 rounded-full inline-block mb-4">
                <Coffee className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Comfortable Reading</h3>
              <p className="text-gray-600">
                Customizable fonts, themes, and reading modes to suit your preferences.
              </p>
            </div>
            <div className="p-6 bg-teal-50 rounded-lg">
              <div className="p-4 bg-teal-100 rounded-full inline-block mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Personalized</h3>
              <p className="text-gray-600">
                Get recommendations based on your reading history and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="container mx-auto px-6 py-16" id='books'>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Popular This Week</h2>
          <a href="#" className="text-teal-600 hover:text-teal-800 flex items-center">
            View All <ChevronRight className="ml-1 h-5 w-5" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((book) => (
            <div key={book} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <img
                src={`/api/placeholder/240/320`}
                alt={`Book cover ${book}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">Book Title {book}</h3>
                <p className="text-sm text-gray-600 mb-2">Author Name</p>
                <div className="flex items-center text-yellow-400 text-sm">
                  {'★'.repeat(5)} <span className="ml-1 text-gray-600">(4.8)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-teal-600 py-16 rounded-md">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Looking for something specific?</h2>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              className="w-full py-4 px-6 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-500 p-3 rounded-full text-white hover:bg-teal-700 transition">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Readers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              text: "NavTok has completely transformed how I read. The personalized recommendations are spot on!"
            },
            {
              name: "Michael Chen",
              text: "I've discovered so many amazing books I would never have found otherwise. The reading experience is seamless."
            },
            {
              name: "Emily Rodriguez",
              text: "As a busy professional, being able to pick up where I left off across all my devices is a game-changer."
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <p className="font-bold text-gray-800">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to start reading?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who have already discovered their next favorite book on NavTok.
          </p>
          <button className="px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition text-lg" onClick={() => navigate('/auth')}>
            Sign Up for Free
          </button>
          <p className="mt-4 text-gray-600">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
   
    </div>
    <div>
       <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-0 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-teal-400" />
                <span className="ml-2 text-xl font-bold">NavTok</span>
              </div>
              <p className="text-gray-400">
                Your personal digital library, available anytime, anywhere.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Books</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Categories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Authors</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">New Releases</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates on new books and features.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-md focus:outline-none text-gray-800 w-full"
                />
                <button className="bg-teal-600 px-4 py-2 rounded-r-md hover:bg-teal-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NavTok. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;