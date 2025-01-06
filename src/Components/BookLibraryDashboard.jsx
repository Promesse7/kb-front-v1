import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Search, Settings, HomeIcon, LibraryIcon, BellIcon,
   HeartIcon, PlusIcon, ArrowRightIcon,
  HelpCircleIcon, LogOutIcon, ArrowLeftIcon, MenuIcon, XIcon,
  BookOpenIcon, PenTool, DollarSign, Briefcase, Target, 
  UploadCloudIcon} from 'lucide-react';
import logo from '../Images/Hb_logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatarDefault from '../Images/user-icon.png';
const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Local backend
    : process.env.NEXT_PUBLIC_BACKEND_URL;

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);  // Renamed from 'error' to 'errorMessage'
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(avatarDefault);
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);


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
        
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data);
        setAvatar(response.data.avatar);
      } catch (error) {
        console.error('Error fetching profile:', error);
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

 

  if (errorMessage) {
    return <p style={{ color: 'red' }}>{errorMessage}</p>; // Display an error message
  }

 
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-800"></div>
      </div>
    );
  }



  const categories = [
    { name: "Money/Investing", icon: <DollarSign size={24} color="green" /> },
    { name: "Design", icon: <PenTool size={24} color="purple" /> },
    { name: "Business", icon: <Briefcase size={24} color="blue" /> },
    { name: "Self Improvement", icon: <Target size={24} color="orange" /> },
  ];

  return (
    
    <div className="flex flex-col lg:flex-row min-h-screen bg-stone-100">
         <ToastContainer />
    <div className="flex flex-col lg:flex-row min-h-screen bg-stone-100">

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
          <div className="text-gray-400 text-sm flex items-center cursor-pointer hover:text-coral-800">
            <MenuIcon className='mr-2' />MENU
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-coral-500 font-medium">
              <div className="w-8 h-8 bg-coral-100 rounded-lg flex items-center justify-center">
                <HomeIcon />
              </div>
              Discover
            </div>

            <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className='hover:text-coral-800' />
              </div>
              Category
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <LibraryIcon />
              </div>
              My Library
            </div>
      <Link to="/book-upload" className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800">
            <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <UploadCloudIcon />
              </div>
           Upload
            </div>
      </Link>
            <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-coral-800">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <HeartIcon />
              </div>
              Favorite
            </div>
          </div>
        </nav>

        <div className="pt-10 border-t border-gray-200 text-sm font-medium text-gray-600 space-y-2">
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
          <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Discover</h1>
          <Link to="/profile" className="px-4 py-2 bg-teal-800 text-white rounded-lg">
            <div className="flex items-center gap-4">
              <img 
                src={profile.avatar} 
                alt="User avatar" 
                className="rounded-full w-10 h-10 object-cover"
              />
              <span className="font-medium">
                {user?.name || 'User'}
              </span>
              <BellIcon className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 flex flex-col lg:flex-row gap-2">
            <select className="px-4 py-2 rounded-lg bg-white border border-gray-200">
              <option>All Categories</option>
            </select>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="find the book you like..."
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <button className="px-6 py-2 bg-teal-800 text-white rounded-lg">
            Search
          </button>
        </div>

        {/* Book Recommendations */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Book Recommendations</h2>
            <button className="text-sm text-gray-600">View all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-fit rounded-lg mb-4"
                />
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            ))}
          </div>
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
      </main>
      </div>
   </div>
  );
};

export default DashBoard;
