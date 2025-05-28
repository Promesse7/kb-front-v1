import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Search, Settings, HomeIcon, LibraryIcon, BellIcon,
  HeartIcon, PlusIcon, ArrowRightIcon,
  HelpCircleIcon, LogOutIcon, ArrowLeftIcon, MenuIcon, XIcon,
  BookOpenIcon, PenTool, DollarSign, Briefcase, Target,
  UploadCloudIcon
} from 'lucide-react';
import logo from '../Images/Hb_logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatarDefault from '../Images/user-icon.png';
import BookUpload from './BookUpload';
import BookLibrary from './BookLibrary';
import BookReader from "./BookReader"

const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Local backend
    : 'https://kb-library.onrender.com';

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);  // Renamed from 'error' to 'errorMessage'
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(avatarDefault);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [bookToConfirm, setBookToConfirm] = useState(null);
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [selectedTab, setSelectedTab] = useState("discover");
  const [selectedBook, setSelectedBook] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true); // Start loading before making the request
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backendUrl}/api/auth/check-status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            key: 'NsuG-TIYDKU'
          }
        });

        setIsAuthenticated(response.data.isAuthenticated);

      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);

        // Clear the token if it's invalid
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [backendUrl]);

  useEffect(() => {
    const fetchBooks = async () => {
  try {
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
  }
};


    fetchBooks();
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

// Connect to WebSocket in useEffect


// Add this function to mark notifications as read
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

  if (errorMessage) {
    return <p style={{ color: 'red' }}>{errorMessage}</p>; // Display an error message
  }



  // Function to handle book selection with confirmation
  const handleReadBook = (book) => {
    setBookToConfirm(book); // Show the popup for this book
  };

  // Function to confirm reading
  const confirmReading = () => {
    setSelectedBook(bookToConfirm);
    setBookToConfirm(null); // Close the popup
  };

  // Function to cancel reading
  const cancelReading = () => {
    setBookToConfirm(null); // Close the popup without selecting
  };

  // Function to close the BookReader
  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  const handleEditBook = (bookId) => {
    navigate(`/edit/${bookId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "discover":
        return (
          <>
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 flex flex-col lg:flex-row gap-2">
                <select className="px-4 py-2 rounded-lg bg-white border border-gray-200">
                  <option>All Categories</option>
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Find the book you like..."
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 capitalise"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <button className="px-6 py-2 bg-teal-800 text-white rounded-lg">
                Search
              </button>
            </div>

            {/* Book Recommendations */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Book Recommendations</h2>
                <button className="text-sm text-gray-600">View all</button>
              </div>
         {loading ? (
  <p>Loading...</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {books && books.length > 0 ? (
      books.map((book, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h3 className="font-medium">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>

          <div className="flex justify-around mt-2">
            <button
              onClick={() => handleReadBook(book)}
              className="px-2 py-2 bg-teal-800 text-white rounded hover:bg-teal-900"
            >
              Read Book
            </button>

            {userRole === 'admin' && (
              <button
                onClick={() => handleEditBook(book._id)}
                className="px-2 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit Book
              </button>
            )}
          </div>
        </div>
      ))
    ) : (
      <p>No books available.</p>
    )}
  </div>
)}

              
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-xl font-medium mb-4">Book Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <div>{category.icon}</div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </>
        );


      case "categories":
        return (
          <>
            <h2 className="text-xl font-medium mb-4">Book Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div>{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              ))}
            </div>
          </>
        );

      case "upload":
        return (
          <BookUpload />
        );

      case "library":
        return (
          <BookLibrary />
        );
      default:
        return <p>Select a tab to view content.</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center  items-center min-h-screen bg-gray-100">
        <div className="relative flex flex-col items-center">
          {/* Book Container */}
          <div className="w-40 h-28 bg-white rounded-lg shadow-lg transform perspective-1000">
            {/* Left Page */}
            <div className="absolute left-0 w-1/2 h-full bg-gray-50 border-r border-gray-200 rounded-l-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-gray-50 to-gray-100 animate-flip-left"></div>
            </div>
            {/* Right Page */}
            <div className="absolute right-0 w-1/2 h-full bg-gray-50 border-l border-gray-200 rounded-r-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-l from-gray-50 to-gray-100 animate-flip-right"></div>
            </div>
            {/* Spine */}
            <div className="absolute inset-0 flex justify-center">
              <div className="w-1 h-full bg-teal-600"></div>
            </div>
          </div>
          {/* Loading Text */}
          <p className="mt-4 text-lg font-semibold text-teal-600 animate-pulse">
            Opening Your Next Adventure...
          </p>
        </div>
      </div>
    );
  }



  const categories = [
    { name: "Money/Investing", icon: <DollarSign size={24} color="green" /> },
    { name: "Design", icon: <PenTool size={24} color="purple" /> },
    { name: "Business", icon: <Briefcase size={24} color="teal" /> },
    { name: "Self Improvement", icon: <Target size={24} color="orange" /> },
  ];

  return (

    <div className='h-screen lg:overflow-hidden'>
      <ToastContainer />
      <div className="flex flex-col lg:flex-row min-h-screen bg-stone-100 ">

        {/* Sidebar */}
        <aside className={`w-full lg:w-64 bg-white p-6 space-y-6 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="font-bold text-xl flex items-center justify-between lg:justify-start">
            <img src={logo} className="w-11 h-11" alt="Logo" />
            Hb
            <button className="lg:hidden" onClick={toggleSidebar}>
              <XIcon size={24} />
            </button>
          </div>

          <nav className="space-y-6 mb-6">
            <div className="text-gray-400 text-sm flex items-center cursor-pointer hover:text-coral-800" onClick={toggleSidebar}>
              <MenuIcon className='mr-2' />MENU
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-coral-500 font-medium">
                <div className={`text-left px-4 py-2 rounded-lg ${selectedTab === "discover" ? "bg-teal-800 text-white" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedTab("discover")}>
                  <HomeIcon />
                </div>
                Discover
              </div>

              <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800">
                <div className={`text-left px-4 py-2 rounded-lg ${selectedTab === "categories" ? "bg-teal-800 text-white" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedTab("categories")}>

                  <BookOpenIcon className='hover:text-coral-800' />
                </div>
                Category
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className={`text-left px-4 py-2 rounded-lg ${selectedTab === "library" ? "bg-teal-800 text-white" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedTab("library")}>
                  <LibraryIcon />
                </div>
                My Library
              </div>

              <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800">
                <div className={`text-left px-4 py-2 rounded-lg ${selectedTab === "upload" ? "bg-teal-800 text-white" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedTab("upload")}>

                  <UploadCloudIcon />
                </div>
                Upload
              </div>

              <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800">
                <div className={`text-left px-4 py-2 rounded-lg ${selectedTab === "favorite" ? "bg-teal-800 text-white" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedTab("favorite")}>
                  <HeartIcon />
                </div>
                Favorite
              </div>
            </div>
          </nav>

          <div className="pt-10 border-t border-gray-200 text-sm font-medium text-gray-600 space-y-2 mt-[20vh]">
            <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-500">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings />
              </div>
              Setting
            </div>

            <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-500">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <HelpCircleIcon />
              </div>
              Help
            </div>

            <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800" onClick={handleLogout}>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center" >
                <LogOutIcon />
              </div>
              Log out
            </div>
          </div>
        </aside>


        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold capitalize">{selectedTab}</h1>
            <Link to="/profile" className="px-4 py-2 bg-teal-800 text-white rounded-lg">
              <div className="flex items-center gap-4">
                {avatar ? (
                  <img src={avatar} alt="User Avatar" className="rounded-full w-10 h-10 object-cover" />
                ) : (
                  <div>No Avatar Available</div>
                )}

                <span className="font-medium">
                  {user?.name || 'User'}
                </span>
                {/* Notification Bell */}
<div className="relative">
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
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
      <div className="p-3 border-b border-gray-200 font-medium">Notifications</div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification, index) => (
            <div 
              key={index} 
              className={`p-3 border-b border-gray-100 ${notification.isRead ? '' : 'bg-blue-50'}`}
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
            </Link>
          </div>
          <div>
          </div>


          {renderContent(selectedTab)}

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
        </main>
      </div>
    </div>
  );
};

export default DashBoard;
