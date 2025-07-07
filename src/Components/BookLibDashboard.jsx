import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, User, Bell, BookOpen,BellIcon, Star, TrendingUp, Users, Heart, HeartIcon, MessageCircle, Share2, Clock, Eye } from 'lucide-react';
import avatarDefault from '../Images/user-icon.png';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookReader from './BookReader';
const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Local backend
    : 'https://kb-library.onrender.com';

const NovTokHomepage = () => {
  const [user, setUser] = useState(null);  
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [avatar, setAvatar] = useState(avatarDefault);
  const [notifications, setNotifications] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToConfirm, setBookToConfirm] = useState(null);
  const [query, setQuery] = useState('');
  const trendingStories = [
    {
      id: 5,
      title: "Neon Nights",
      author: "CyberAuthor",
      reads: "534K",
      votes: "67K",
      trend: "+45%"
    },
    {
      id: 6,
      title: "Heartbreak Hotel",
      author: "RomanticSoul",
      reads: "789K",
      votes: "91K",
      trend: "+32%"
    },
    {
      id: 7,
      title: "Mystery Manor",
      author: "ThrillerFan",
      reads: "645K",
      votes: "78K",
      trend: "+28%"
    }
  ];
  
  
  const genres = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology',  'Biography',
      'Romance', 'Business', 'Self-Help', 'History',
    'Arts', 'Poetry', 'Drama', 
  ];

  const markNotificationsAsRead = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/notifications/read`, 
        {}, 
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setHasUnreadNotifications(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${backendUrl}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Check if response.data is available and contains 'avatar'
        if (response.data && response.data.avatar) {
          setProfile(response.data);
          setUserRole(response.data.role); // Assuming the response contains a 'role' field
          setAvatar(response.data.avatar);
        } else {
          setAvatar(null); // Set to null if no avatar found
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProfile();
  }, []);

  // Fetch books                                                  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        const response = await axios.get(`${backendUrl}/api/books`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Safely handle the response
        const booksData = response.data?.books || response.data || [];
        setBooks(Array.isArray(booksData) ? booksData : []); 

      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]); // Set to empty array on error
      }finally{
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setErrorMessage(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/auth/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/auth');
            throw new Error('Session expired. Please login again.');
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data); // Set the user data
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

 // Function to cancel reading
  const cancelReading = () => {
    setBookToConfirm(null); // Close the popup without selecting
  };
   // Function to handle book selection with confirmation
  const handleReadBook = (book) => {
    setBookToConfirm(book); // Show the popup for this book
  };

  // Function to confirm reading
  const confirmReading = () => {
    setSelectedBook(bookToConfirm);
    setBookToConfirm(null); // Close the popup
  };
  const handleCloseReader = () => {
    setSelectedBook(null);
  };

    const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/book-library?search=${encodeURIComponent(query.trim())}`);
  };


  return (
    <div className="max-h-[96vh] bg-white rounded-lg shadow-lg overflow-y-auto mb-8">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-teal-900">NovTok</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
             <form onSubmit={handleSearch}>
  <div className="relative">
    <div
      onClick={handleSearch} // search on icon click
      className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer hover:text-teal-900"
    >
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Search stories, authors, genres..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-900 focus:border-transparent"
    />
  </div>
</form>

            </div>

            {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
  {/* Notification Bell */}
  <button className="text-gray-600 hover:text-teal-900 transition-colors self-end sm:self-auto">
    <Bell className="h-6 w-6" />
  </button>

  {/* User Profile & Notifications */}
  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full sm:w-auto">
    <div
      className="px-3 py-2 bg-teal-800 text-white rounded-lg cursor-pointer hover:bg-teal-900 transition-colors w-full sm:w-auto"
      onClick={() => navigate('/profile')}
    >
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        {avatar ? (
          <img
            src={avatar}
            alt="User Avatar"
            className="rounded-full w-10 h-10 object-cover"
          />
        ) : (
          <div className="text-sm text-gray-200">No Avatar</div>
        )}

        <span className="font-medium text-sm sm:text-base">
          {user?.name || 'User'}
        </span>
      </div>
    </div>

    {/* Notification Dropdown */}
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => {
          setShowNotifications(!showNotifications);
          if (hasUnreadNotifications) {
            markNotificationsAsRead();
          }
        }}
        className="p-2 relative"
      >
        <BellIcon className="w-6 h-6 text-gray-600" />
        {hasUnreadNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200 max-h-[60vh] overflow-y-auto">
          <div className="p-3 border-b border-gray-200 font-medium">Notifications</div>
          <div className="">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-3 border-b border-gray-100 ${
                    notification.isRead ? '' : 'bg-blue-50'
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  </div>
</div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto rounded-lg">
        {/* Hero Section */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold mb-4">
                Share Your book with the World
              </h2>
              <p className="text-xl mb-6 text-teal-100">
                Join millions of readers and writers on NovTok. Discover new stories, connect with fellow book lovers, and share your own creative journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-teal-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Start Reading
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-teal-900 transition-colors">
                  Start Writing
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Featured Stories */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Featured Stories</h3>
                <button className="text-teal-900 hover:text-teal-700 font-medium"
                    onClick={() => navigate('/all-books')}
                >
                  View All
                </button>
              </div>
   <div className="overflow-x-auto">
  <div className="flex space-x-4 min-w-max mb-1 px-2 sm:px-4">
    {loading ? (
      <div className="w-full flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-teal-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
    ) : books && books.length > 0 ? (
      books.map((book, index) => (
        <div
          key={book._id || index}
          className="w-[65vw] sm:w-[40vw] md:w-[25vw] lg:w-[18vw] flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          <div className="relative">
            <img
              src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'}
              alt={book.title}
              className="w-full h-44 sm:h-48 object-cover rounded-t-lg"
              onClick={() => handleReadBook(book)}
            />
            <div className="absolute top-2 right-2">
              <span className="bg-teal-900 text-white px-2 py-1 rounded text-xs">
                {book.category || book.genre || 'Unknown'}
              </span>
            </div>
            {book.isCompleted && (
              <div className="absolute top-2 left-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                  Complete
                </span>
              </div>
            )}
          </div>
          <div className="p-3 sm:p-4">
            <h4 className="font-bold text-gray-900 mb-1 truncate">{book.title}</h4>
            <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {book.downloads || 0}
                </span>
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {book.likes?.length || 0}
                </span>
              </div>
              <span>{Array.isArray(book.chapters) ? book.chapters.length : 0} Chapters</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm px-4">No books available.</p>
    )}
 
       {/* Conditionally render BookReader */}
          {selectedBook && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-center items-center">
              <div className="relative w-full h-full">
                <button
                  onClick={handleCloseReader}
                  className="absolute top-4 right-4 px-4 py-2 bg-red-700 text-white z-50 rounded hover:bg-red-800 z-60"
                >
                  Close
                </button>
                <BookReader book={selectedBook} />
              </div>
            </div>
          )}

          {/* Confirmation Popup */}
          {bookToConfirm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Reading</h3>
                <p className="mb-6">
                  Do you want to read <span className="font-medium">"{bookToConfirm.title}"</span> by{" "}
                  <span className="font-medium">{bookToConfirm.author}</span>?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={cancelReading}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReading}
                    className="px-4 py-2 bg-teal-800 text-white rounded hover:bg-teal-900"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
  </div>
</div>

            </section>
            
            {/* Genre Categories */}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Genre</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className="bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-lg p-4 text-center transition-colors"
                  >
                    <div className="text-lg font-medium text-gray-900">{genre}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Popular Stories */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Popular Stories</h3>
                <button className="text-teal-900 hover:text-teal-700 font-medium"
                    onClick={() => navigate('/all-books')}
                >
                  View All
                </button>
              </div>
            <div className="overflow-x-hidden">
  <div className="flex space-x-4 min-w-max mb-1">
    {loading ? (
  <div className="w-full flex justify-center items-center py-10">
    <svg className="animate-spin h-8 w-8 text-teal-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
  </div>
) : books && books.length > 0 ? (

      books.map((book, index) => (
        <div
          key={book._id || index}
          className="w-[12.5vw] flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          <div className="relative">
            <img
              src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'}
              alt={book.title}
              className="w-full h-48 object-fit-cover rounded-t-lg"
              onClick={() => handleReadBook(book)}
            />
            <div className="absolute top-2 right-2">
              <span className="bg-teal-900 text-white px-2 py-1 rounded text-xs">
                {book.category || book.genre || 'Unknown'}
              </span>
            </div>
            {book.isCompleted && (
              <div className="absolute top-2 left-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                  Complete
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-bold text-gray-900 mb-1 truncate">{book.title}</h4>
            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {book.downloads || 0}
                </span>
                <span className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {book.likes?.length || 0}
                </span>
              </div>
              <span>{Array.isArray(book.chapters) ? book.chapters.length : 0} Chapters</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No books available.</p>
    )}

       {/* Conditionally render BookReader */}
          {selectedBook && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-center items-center">
              <div className="relative w-full h-full">
                <button
                  onClick={handleCloseReader}
                  className="absolute top-4 right-4 px-4 py-2 bg-red-700 text-white z-50 rounded hover:bg-red-800 z-60"
                >
                  Close
                </button>
                <BookReader book={selectedBook} />
              </div>
            </div>
          )}

          {/* Confirmation Popup */}
          {bookToConfirm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Reading</h3>
                <p className="mb-6">
                  Do you want to read <span className="font-medium">"{bookToConfirm.title}"</span> by{" "}
                  <span className="font-medium">{bookToConfirm.author}</span>?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={cancelReading}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReading}
                    className="px-4 py-2 bg-teal-800 text-white rounded hover:bg-teal-900"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
  </div>
</div>

            </section>
          </div>
 
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Trending Now */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-teal-900" />
                Trending Now
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {books.map((book, index) => (
                  <div key={book.id} className="flex items-center space-x-3 mb-4 last:mb-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                      <p className="text-xs text-gray-500">by {book.author}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Eye className="h-3 w-3 mr-1" />
                        {book.reads}
                        <span className="ml-2 text-green-600 font-medium">{book.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Community Stats */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-teal-900" />
                Community
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-900">25+</div>
                  <div className="text-sm text-gray-600">Active Writers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-900">150+</div>
                  <div className="text-sm text-gray-600">Stories Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-900">5k+</div>
                  <div className="text-sm text-gray-600">Monthly Readers</div>
                </div>
              </div>
            </section>

            {/* Writing Tips */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-teal-900" />
                Writing Tips
              </h3>
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 mb-1">Daily Writing Challenge</div>
                    <div className="text-gray-600">Write 500 words today and join thousands of writers building their craft!</div>
                  </div>
                  <button className="w-full bg-teal-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors">
                    Join Challenge
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
        </section>

        
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-teal-900 mb-4">NovTok</h3>
              <p className="text-gray-600 text-sm">
                The world's largest community for readers and writers. Share your book, discover new worlds.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-teal-900">Writing Contests</a></li>
                <li><a href="#" className="hover:text-teal-900">Author Spotlight</a></li>
                <li><a href="#" className="hover:text-teal-900">Book Clubs</a></li>
                <li><a href="#" className="hover:text-teal-900">Forums</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-teal-900">Writing Guide</a></li>
                <li><a href="#" className="hover:text-teal-900">Publishing Tips</a></li>
                <li><a href="#" className="hover:text-teal-900">Genre Guide</a></li>
                <li><a href="#" className="hover:text-teal-900">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-teal-900">About Us</a></li>
                <li><a href="#" className="hover:text-teal-900">Careers</a></li>
                <li><a href="#" className="hover:text-teal-900">Press</a></li>
                <li><a href="#" className="hover:text-teal-900">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 NovTok. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NovTokHomepage;