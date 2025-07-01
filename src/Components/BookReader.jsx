import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Added missing import
import { 
  ChevronLeft, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Plus,
  Minus,
  Type,
  Sun,
  Moon,
  Maximize,
  Minimize
} from 'lucide-react';
import avatarDefault from '../Images/user-icon.png';
import { useNavigate } from 'react-router-dom';

const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Local backend
    : 'https://kb-library.onrender.com';

const BookReader = ({ book }) => {
  // Reader-specific states
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmark, setBookmark] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // App-level states (these should ideally be in parent component)
  const [user, setUser] = useState(null);  
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToConfirm, setBookToConfirm] = useState(null);

  // Sample book data for demonstration
  const bookData = book || {
    title: "The Great Adventure",
    author: "Jane Doe",
    chapters: [
      {
        title: "Chapter 1: The Beginning",
        content: "In a small village nestled between rolling hills and whispering forests, there lived a young woman named Elena who dreamed of adventures beyond the horizon. Every morning, she would climb to the highest tower of her family's cottage and gaze out at the distant mountains, wondering what mysteries lay hidden in their shadowy peaks.\n\nThe village of Millhaven was peaceful, perhaps too peaceful for someone with Elena's restless spirit. The cobblestone streets wound lazily between houses with thatched roofs, and the most exciting event of the week was the market day when traveling merchants would bring news from distant lands.\n\nBut today felt different. As Elena descended from her morning vigil, she noticed a peculiar glimmer in the forest edge—something that hadn't been there the day before. Her heart quickened with the possibility of discovery, and she knew that her quiet life was about to change forever."
      },
      {
        title: "Chapter 2: The Discovery",
        content: "Elena approached the forest with cautious excitement, her leather boots crunching softly on the fallen leaves that carpeted the woodland floor. The glimmer she had seen from her tower grew brighter as she drew closer, pulsing with an ethereal light that seemed to dance between the ancient oak trees.\n\nWhat she found defied all explanation—a crystalline artifact, no larger than her palm, hovering just above a circle of mushrooms that had grown in a perfect ring. The crystal pulsed with inner light, casting rainbow reflections on the surrounding bark and leaves.\n\nAs Elena reached out to touch it, the crystal began to sing—a melodious hum that resonated through her bones and filled her mind with visions of distant worlds and forgotten magic. She knew, without a doubt, that this was the beginning of the adventure she had always dreamed of."
      }
    ],
    reads: "1.2K",
    votes: "89",
    comments: "34"
  };

  // Theme configurations
  const themes = {
    light: {
      background: 'bg-white',
      text: 'text-gray-800',
      paper: 'bg-stone-50'
    },
    sepia: {
      background: 'bg-amber-50',
      text: 'text-amber-900',
      paper: 'bg-amber-100'
    },
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      paper: 'bg-gray-800'
    }
  };

  // Fetch books                                                  
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

  const totalChapters = bookData.chapters.length;
  const currentChapter = bookData.chapters[currentPage - 1];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleBookmark = () => {
    if (bookmark === currentPage) {
      setBookmark(null);
      setIsBookmarked(false);
    } else {
      setBookmark(currentPage);
      setIsBookmarked(true);
    }
  };

  const changePage = (direction) => {
    const newPage = currentPage + direction;
    if (newPage > 0 && newPage <= totalChapters) {
      setCurrentPage(newPage);
    }
  };

  const adjustFontSize = (change) => {
    const newSize = fontSize + change;
    if (newSize >= 12 && newSize <= 24) {
      setFontSize(newSize);
    }
  };

  const currentTheme = themes[theme];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Split books into chunks of 2
  const chunkBooks = (books || []).reduce((acc, curr, i) => {
    const chunkIndex = Math.floor(i / 2);
    if (!acc[chunkIndex]) acc[chunkIndex] = [];
    acc[chunkIndex].push(curr);
    return acc;
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % chunkBooks.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [chunkBooks.length]);


  // Render nested BookReader only if selectedBook exists and is different from current book
  const NestedBookReader = ({ book }) => {
    const [nestedCurrentPage, setNestedCurrentPage] = useState(1);
    const [nestedFontSize, setNestedFontSize] = useState(18);
    const [nestedTheme, setNestedTheme] = useState('light');

    const nestedBookData = book || bookData;
    const nestedTotalChapters = nestedBookData.chapters?.length || 0;
    const nestedCurrentChapter = nestedBookData.chapters?.[nestedCurrentPage - 1];

    const nestedChangePage = (direction) => {
      const newPage = nestedCurrentPage + direction;
      if (newPage > 0 && newPage <= nestedTotalChapters) {
        setNestedCurrentPage(newPage);
      }
    };

    const nestedAdjustFontSize = (change) => {
      const newSize = nestedFontSize + change;
      if (newSize >= 12 && newSize <= 24) {
        setNestedFontSize(newSize);
      }
    };

    const nestedCurrentTheme = themes[nestedTheme];

    return (
      <div className={`min-h-screen ${nestedCurrentTheme.background} transition-colors duration-300`}>
        {/* Header */}
        <div className={`sticky top-0 z-50 ${nestedCurrentTheme.background} border-b border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCloseReader}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ChevronLeft className={`w-5 h-5 ${nestedCurrentTheme.text}`} />
              </button>
              <div>
                <h1 className={`font-semibold ${nestedCurrentTheme.text} text-sm`}>{nestedBookData.title}</h1>
                <p className="text-xs text-gray-500">by {nestedBookData.author}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Font Size Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => nestedAdjustFontSize(-1)}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  disabled={nestedFontSize <= 12}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <Type className="w-4 h-4" />
                <button
                  onClick={() => nestedAdjustFontSize(1)}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  disabled={nestedFontSize >= 24}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Theme Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setNestedTheme('light')}
                  className={`p-2 rounded transition-colors ${nestedTheme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setNestedTheme('sepia')}
                  className={`p-2 rounded transition-colors ${nestedTheme === 'sepia' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setNestedTheme('dark')}
                  className={`p-2 rounded transition-colors ${nestedTheme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Header */}
        <div className={`${nestedCurrentTheme.paper} px-4 py-6 border-b border-gray-200 dark:border-gray-700`}>
          <div className="max-w-2xl mx-auto">
            <h2 className={`text-xl font-bold ${nestedCurrentTheme.text} mb-2`}>
              {nestedCurrentChapter?.title || `Chapter ${nestedCurrentPage}`}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="prose prose-gray max-w-none">
            {nestedCurrentChapter?.content.split('\n\n').map((paragraph, index) => (
              <p 
                key={index} 
                className={`mb-6 ${nestedCurrentTheme.text} leading-relaxed`}
                style={{ fontSize: `${nestedFontSize}px` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Chapter {nestedCurrentPage} of {nestedTotalChapters}</span>
            <span>{Math.round((nestedCurrentPage / nestedTotalChapters) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(nestedCurrentPage / nestedTotalChapters) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={`sticky bottom-0 ${nestedCurrentTheme.background} border-t border-gray-200 dark:border-gray-700 px-4 py-3`}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => nestedChangePage(-1)}
                disabled={nestedCurrentPage <= 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={() => nestedChangePage(1)}
                disabled={nestedCurrentPage >= nestedTotalChapters}
                className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Chapter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} transition-colors duration-300`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${currentTheme.background} border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ChevronLeft className={`w-5 h-5 ${currentTheme.text}`} />
            </button>
            <div>
              <h1 className={`font-semibold ${currentTheme.text} text-sm`}>{bookData.title}</h1>
              <p className="text-xs text-gray-500">by {bookData.author}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Font Size Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustFontSize(-1)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={fontSize <= 12}
              >
                <Minus className="w-4 h-4" />
              </button>
              <Type className="w-4 h-4" />
              <button
                onClick={() => adjustFontSize(1)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={fontSize >= 24}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded transition-colors ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-2 rounded transition-colors ${theme === 'sepia' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded transition-colors ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={toggleBookmark}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors 
                ${isBookmarked ? 'text-teal-500' : currentTheme.text}`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Header */}
      <div className={`${currentTheme.paper} py-2 border-b border-gray-200 dark:border-gray-700`}>
        <div className="max-w-2xl mx-auto  flex items-center">
          <h2 className={`text-xl font-bold ${currentTheme.text} mb-2`}>
            {currentChapter?.title || `Chapter ${currentPage}`}
          </h2>
          
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm mx-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{bookData.reads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{bookData.votes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{bookData.comments}</span>
            </div>
          </div>
        </div>
      </div>

    <div className="flex flex-col md:flex-row h-[68vh] overflow-hidden">
  {/* Chapter Content */}
  <div className="flex-1 overflow-y-auto px-6 py-8">
    <div className="max-w-2xl mx-auto">
      <div className="prose prose-gray max-w-none">
        {currentChapter?.content.split('\n\n').map((paragraph, index) => (
          <p
            key={index}
            className={`mb-6 ${currentTheme.text} leading-relaxed`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  </div>

  {/* Book Sidebar */}
   <div className="w-full md:w-[16rem] bg-gray-50 p-2 border-l">
      <div>
        <h1 className="text-2xl font-bold mb-4">You may also like</h1>
      </div>

      <div className="space-y-4 transition-all duration-500 ease-in-out">
        {chunkBooks.length > 0 ? (
          chunkBooks[currentIndex].map((book, index) => (
            <div
              key={book._id || index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'}
                  alt={book.title}
                  className="w-full h-24 object-cover rounded-t-lg"
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
                      Completed
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-bold text-gray-900 mb-1 truncate">{book.title}</h4>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
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
      </div>
    </div>

  {/* Book Reader Modal */}
  {selectedBook && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="relative w-full h-full md:w-4/5 md:h-[90%] bg-white rounded-lg overflow-hidden shadow-lg">
        <NestedBookReader book={selectedBook} />
      </div>
    </div>
  )}

  {/* Confirm Popup */}
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


      {/* Progress Indicator */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Chapter {currentPage} of {totalChapters}</span>
          <span>{Math.round((currentPage / totalChapters) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / totalChapters) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={`sticky bottom-0 ${currentTheme.background} border-t border-gray-200 dark:border-gray-700 px-4 py-3`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">Vote</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Comment</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => changePage(-1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={() => changePage(1)}
              disabled={currentPage >= totalChapters}
              className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;