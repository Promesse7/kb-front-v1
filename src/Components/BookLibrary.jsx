import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  BookOpen, Library, ListPlus, FolderPlus, BookMarked, ThumbsUp,
  Edit, Trash2, Plus, Check, Star, Search, Filter, Tag,
  Share2, Download, Upload, BookmarkPlus, Settings, X
} from 'lucide-react';

const BookLibrary = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    shelf: [],
    rating: [],
    favorite: false
  });
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewMode, setViewMode] = useState('details'); // 'details' or 'reading'
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : 'https://kb-library.onrender.com';

  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  // Add these state variables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [booksPerPage] = useState(8); // Number of books per page
  // Add sorting state
  const [sortBy, setSortBy] = useState('createdAt'); // Default sort by date added
  const [sortOrder, setSortOrder] = useState('desc'); // Descending order by default
  // Add these states
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [userRating, setUserRating] = useState(0);
  let currentUserId;

  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      currentUserId = decoded?.id || decoded?.userId || decoded?.sub;
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
  }
  const addTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...(selectedBook.tags || []), newTag.trim()];
      updateBook(selectedBook._id, { tags: updatedTags });
      setNewTag('');
    }
    setIsAddingTag(false);
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = (selectedBook.tags || []).filter(tag => tag !== tagToRemove);
    updateBook(selectedBook._id, { tags: updatedTags });
  };

  const likeBook = async (id) => {
    try {
      await axios.post(`${backendUrl}/api/books/${id}/like`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      // Update the book in the local state
      setBooks(prev => prev.map(book => {
        if (book._id === id) {
          const userIndex = book.likes?.indexOf(currentUserId);
          let updatedLikes = [...(book.likes || [])];

          if (userIndex === -1) {
            updatedLikes.push(currentUserId);
          } else {
            updatedLikes.splice(userIndex, 1);
          }

          return { ...book, likes: updatedLikes };
        }
        return book;
      }));
    } catch (error) {
      console.error('Error liking book:', error);
    }
  };
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found.');
        const response = await axios.get(
          `${backendUrl}/api/books?page=${currentPage}&limit=${booksPerPage}&sort=${sortBy}&order=${sortOrder}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const updateBook = async (id, updates) => {
    try {
      await axios.put(`${backendUrl}/api/books/${id}`, updates, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setBooks(prev => prev.map(book =>
        book._id === id ? { ...book, ...updates } : book
      ));
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/books/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setBooks(prev => prev.filter(book => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      await axios.post(`${backendUrl}/api/books/${id}/favorite`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setBooks(prev =>
        prev.map(b =>
          b._id === id
            ? {
              ...b,
              favorites: b.favorites.includes(userId)
                ? b.favorites.filter(fav => fav !== userId)
                : [...b.favorites, userId]
            }
            : b
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };



  useEffect(() => {
    if (selectedBook) {
      fetchComments(selectedBook._id);
      // Check if user has rated this book before
      const userRatedBook = selectedBook.ratings?.find(rating => rating.userId === currentUserId);
      if (userRatedBook) {
        setUserRating(userRatedBook.rating);
      } else {
        setUserRating(0);
      }
    }
  }, [selectedBook]);

  // Fetch comments function
  const fetchComments = async (bookId) => {
    try {
      // Make the GET request to fetch the comments
      const response = await axios.get(`${backendUrl}/api/books/${bookId}/comments`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      // Set the comments in state
      if (response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Optionally show a user-friendly error message
      // setError('Failed to fetch comments, please try again later');
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return; // Check if comment is empty or just spaces

    try {
      // Make the POST request to add the comment
      const response = await axios.post(
        `${backendUrl}/api/books/${selectedBook._id}/comment`,
        { content: commentText },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      // Assuming response.data contains the newly added comment
      const newComment = response.data;

      // Update the state with the new comment added to the existing list
      setComments((prevComments) => [...prevComments, newComment]);

      // Clear the comment input field
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };


  // Rate book function
  const rateBook = async (rating) => {
    try {
      // Post the rating to the backend
      await axios.post(
        `${backendUrl}/api/books/${selectedBook._id}/rate`,
        { rating },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      // Update user rating in the state
      setUserRating(rating);

      // Update the book in state with the new rating
      setSelectedBook((prev) => {
        const totalRatings = prev.rating.totalRatings + 1; // Increment the total ratings
        const averageRating = ((prev.rating.averageRating * prev.rating.totalRatings) + rating) / totalRatings; // Recalculate the average rating

        return {
          ...prev,
          rating: {
            averageRating,
            totalRatings,
          },
        };
      });
    } catch (error) {
      console.error('Error rating book:', error);
    }
  };



  // Filter books based on search query and filters
  const filteredBooks = books.filter(book => {
    // Search query filter
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = selectedFilters.status.length === 0 ||
      selectedFilters.status.includes(book.status);

    // Favorite filter
    const matchesFavorite = !selectedFilters.favorite || book.favorite;

    return matchesSearch && matchesStatus && matchesFavorite;
  });

  const Modal = ({
    children,
    title,
    onClose,
    fullScreen = false,
    className = ""
  }) => {
    // Handle escape key press to close modal
    useEffect(() => {
      const handleEscapeKey = (e) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [onClose]);

    // Prevent scrolling on the body when modal is open
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{ transform: 'translateY(-24px)' }}
      >
        <div
          className={`
            bg-gray-800 
            rounded-xl shadow-2xl 
            border border-gray-200 dark:border-gray-700
            ${fullScreen ? 'w-full h-full' : 'w-full max-w-4xl max-h-[85vh]'} 
            overflow-hidden
            transform transition-all duration-300 ease-out
            ${className}
          `}

          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-850">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: fullScreen ? 'calc(100% - 4rem)' : '80vh' }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  const ReadingView = ({ book }) => {
    const [currentChapter, setCurrentChapter] = useState(0);
    const contentRef = useRef(null);

    // Handle Keyboard Navigation
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
          prevChapter();
        } else if (event.key === "ArrowRight") {
          nextChapter();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentChapter]);

    // Smooth scrolling when changing chapters
    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, [currentChapter]);

    // Navigate chapters
    const prevChapter = () => {
      setCurrentChapter((prev) => Math.max(0, prev - 1));
    };

    const nextChapter = () => {
      setCurrentChapter((prev) => Math.min(book.chapters.length - 1, prev + 1));
    };

    const progress = ((currentChapter + 1) / book.chapters.length) * 100;

    // Check if chapters exist and are an array
    if (!book?.chapters || !Array.isArray(book.chapters) || book.chapters.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500">
          No chapters available for this book.
          <button
            onClick={() => setViewMode('details')}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Back to Details
          </button>
        </div>
      );
    }

    return (
      <div className="p-6 pt-0 bg-gray-100 dark:bg-gray-900 min-h-[70vh]">
        {/* Header Section */}
        <div className="flex max-w-2xl mx-auto justify-between items-center m-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-200 truncate">
            {book.title}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={prevChapter}
              disabled={currentChapter === 0}
              className="px-3 md:px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextChapter}
              disabled={currentChapter === book.chapters.length - 1}
              className="px-3 md:px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Chapter Content */}
        <div
          ref={contentRef}
          className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto lg:max-h-[50vh] max-h-[68vh] overflow-y-auto transition-all custom-scrollbar"
        >
          <h3 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4 md:mb-6">
            {book.chapters[currentChapter].title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
            {book.chapters[currentChapter].content}
          </p>
        </div>

        {/* Reading Progress Bar */}
        <div className="w-full max-w-4xl mx-auto bg-gray-200 dark:bg-gray-700 h-2 rounded-full my-6">
          <div
            className="h-2 bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Footer */}
        <div className="flex w-full max-w-4xl mx-auto justify-between items-center text-sm md:text-base text-gray-600 dark:text-gray-400">
          <span>Chapter {currentChapter + 1} of {book.chapters.length}</span>
          <button
            onClick={() => setViewMode('details')}
            className="px-4 md:px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Back to Details
          </button>
        </div>
      </div>
    );
  };

  const renderBookDetails = () => (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={selectedBook.coverImage}
          alt={selectedBook.title}
          className="w-32 h-40 object-cover rounded"
        />
        <div className='text-gray-200'>
          <h2 className="text-xl font-bold">{selectedBook.title}</h2>
          <p className="text-gray-600">{selectedBook.author}</p>
          {/* Rating Section */}
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Your Rating</h3>
            <div className="flex gap-1">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 cursor-pointer ${i < userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  onClick={() => rateBook(i + 1)}
                />
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Comments ({comments.length})
            </h3>

            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
              {comments.map(comment => (
                <div key={comment._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-700 dark:text-gray-200">
                      {comment.userId.username || 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{comment.content}</p>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              />
              <button
                onClick={addComment}
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600
                disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {/* Notes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Notes
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {selectedBook.notes?.length || 0} characters
            </div>
          </div>
          <textarea
            className="w-full p-3 border border-gray-600 rounded-lg 
                    bg-gray-700 text-gray-800 dark:text-gray-200
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200 h-20 resize custom-scrollbar "
            value={selectedBook.notes || ''}
            onChange={(e) => updateBook(selectedBook._id, { notes: e.target.value })}
            placeholder="Add your thoughts, favorite quotes, or reading insights..."
            rows={5}
          />
        </div>

        {/* Tags Section */}
        <div className="space-y-3 flex justify-around">


          <div className="flex flex-wrap gap-2 min-h-10">
            {(selectedBook.tags || []).map(tag => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 
                      dark:from-blue-900/30 dark:to-blue-800/30
                      text-blue-700 dark:text-blue-300 
                      rounded-full text-sm font-medium flex items-center gap-1
                      border border-blue-200 dark:border-blue-800/50
                      shadow-sm hover:shadow transition-all duration-200"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="w-4 h-4 inline-flex items-center justify-center rounded-full 
                        hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {isAddingTag ? (
              <div className="flex items-center">
                <input
                  type="text"
                  className="px-3 py-1 text-sm border border-blue-300 dark:border-blue-700 
                        rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  autoFocus
                />
                <button
                  onClick={addTag}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 
                        text-white rounded-r-full text-sm transition-colors"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="px-3 py-1.5 border border-dashed border-gray-300 dark:border-gray-600
                      hover:border-blue-400 dark:hover:border-blue-500
                      rounded-full text-sm flex items-center gap-1
                      text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                      transition-colors duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tag
              </button>
            )}
          </div>


          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {(selectedBook.tags || []).length} tags
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setViewMode('reading')}
        className="mt-4  mx-[25vw] px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
      >
        Read Book
      </button>
    </div>
  );

  const renderFilterPanel = () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="font-medium mb-2">Status</h3>
        <div className="space-x-2">
          {['Reading', 'Completed', 'Want to Read'].map(status => (
            <button
              key={status}
              className={`px-3 py-1 rounded-full text-sm ${selectedFilters.status.includes(status)
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100'
                }`}
              onClick={() => {
                setSelectedFilters(prev => ({
                  ...prev,
                  status: prev.status.includes(status)
                    ? prev.status.filter(s => s !== status)
                    : [...prev.status, status]
                }));
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Favorites</h3>
        <button
          className={`px-3 py-1 rounded-full text-sm ${selectedFilters.favorite
            ? 'bg-teal-500 text-white'
            : 'bg-gray-100'
            }`}
          onClick={() => {
            setSelectedFilters(prev => ({
              ...prev,
              favorite: !prev.favorite
            }));
          }}
        >
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 ${selectedFilters.favorite ? 'fill-white' : ''}`} />
            <span>Favorites Only</span>
          </div>
        </button>
      </div>
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => setSelectedFilters({
            status: [],
            shelf: [],
            rating: [],
            favorite: false
          })}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded mr-2"
        >
          Reset Filters
        </button>
        <button
          onClick={() => setShowFilters(false)}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
        {/* Sorting Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); // Reset to first page when changing sort
            }}
            className="pl-3 pr-8 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="createdAt">Date Added</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="rating.averageRating">Rating</option>
            <option value="likes">Most Liked</option>
            <option value="favorites">Most Favorited</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Order Toggle Button */}
        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="p-2 border rounded-lg hover:bg-gray-50"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
        <button
          onClick={() => setIsAddingBook(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          <Plus className="w-5 h-5" />
          Add Book
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
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
      )}

      {/* Book Grid */}
      {!loading && filteredBooks.length === 0 && (
        <div className="text-center text-gray-500 py-8">No books found. Try adjusting your filters.</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-h-[50vh] overflow-y-auto overflow-x-hidden">
        {filteredBooks.map(book => (
          <div key={book._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <button
                onClick={() => toggleFavorite(book._id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
              >
                <Star
                  className={`w-5 h-5 ${book.favorites.includes(currentUserId) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                />
              </button>

            </div>
            <h3 className="font-semibold text-gray-800 line-clamp-1">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            {book.progress < 100 && (
              <div className="mb-2">
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{book.progress}% complete</span>
              </div>
            )}
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => likeBook(book._id)}
                className="flex items-center gap-1 px-1 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                <ThumbsUp className={`w-4 h-4 ${book.likes?.includes(currentUserId) ? 'text-blue-500 fill-blue-500' : ''}`} />
                <span>{book.likes?.length || 0}</span>
              </button>

              <button
                onClick={() => toggleFavorite(book._id)}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                <Star className={`w-4 h-4 ${book.favorite ? 'text-yellow-400 fill-yellow-400' : ''}`} />
              </button>

              <button
                onClick={() => {
                  setSelectedBook(book);
                  setViewMode('details');
                }}
                className="flex-1 px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Details
              </button>

              <button
                onClick={() => deleteBook(book._id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-full ${currentPage === i + 1
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100'
                }`}
            >
              {i + 1}
            </button>
          )).slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          )}

          {currentPage + 2 < totalPages && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-10 h-10 rounded-full bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {showFilters && (
        <Modal title="Filter Books" onClose={() => setShowFilters(false)}>
          {renderFilterPanel()}
        </Modal>
      )}

      {selectedBook && viewMode === 'details' && (
        <Modal title="Book Details" onClose={() => setSelectedBook(null)}>
          {renderBookDetails()}
        </Modal>
      )}

      {selectedBook && viewMode === 'reading' && (
        <Modal
          title={`Reading: ${selectedBook.title}`}
          onClose={() => {
            setViewMode('details');
          }}
          fullScreen={true}
          className="bg-gray-50 dark:bg-gray-900"
        >
          <ReadingView book={selectedBook} />
        </Modal>
      )}

      {isAddingBook && (
        <Modal title="Add New Book" onClose={() => setIsAddingBook(false)}>
          <div className="p-4">
            {/* Add Book Form - Basic Implementation */}
            <form className="space-y-4">
              <div>
                <label className="block mb-1">Title</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Book title" />
              </div>
              <div>
                <label className="block mb-1">Author</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Author name" />
              </div>
              <div>
                <label className="block mb-1">Cover Image URL</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="https://..." />
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <select className="w-full p-2 border rounded">
                  <option>Want to Read</option>
                  <option>Reading</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddingBook(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookLibrary;