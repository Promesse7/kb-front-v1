import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  BookOpen, Library, ListPlus, FolderPlus, BookMarked,
  Edit, Trash2, Plus, Check, Star, Search, Filter,
  Share2, Download, Upload, BookmarkPlus, Settings
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : 'https://kb-library.onrender.com';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found.');
        const response = await axios.get(`${backendUrl}/api/books`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Raw API response:', response.data); // Log raw data
        const booksWithPlainChapters = response.data.map(book => {
          let chapters = book.chapters;
          if (chapters?.toObject) {
            chapters = chapters.toObject();
          } else if (Array.isArray(chapters)) {
            chapters = chapters;
          } else if (chapters && typeof chapters[Symbol.iterator] === 'function') {
            chapters = [...chapters];
          } else {
            chapters = [];
          }
          return {
            ...book,
            chapters
          };
        });
        console.log('Processed books:', booksWithPlainChapters);
        setBooks(booksWithPlainChapters);
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
      const book = books.find(b => b._id === id);
      await axios.put(`${backendUrl}/api/books/${id}`, { favorite: !book.favorite }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setBooks(prev => prev.map(book =>
        book._id === id ? { ...book, favorite: !book.favorite } : book
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
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
      <div className="w-full max-w-5xl  p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg min-h-screen md:min-h-[80vh]">
      {/* Header Section */}
      <div className="flex  max-w-2xl mx-auto justify-between items-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 truncate">
          {book.title}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={prevChapter}
            disabled={currentChapter === 0}
            className="px-4 md:px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextChapter}
            disabled={currentChapter === book.chapters.length - 1}
            className="px-4 md:px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Chapter Content */}
      <div
        ref={contentRef}
        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto max-h-[70vh] md:max-h-[60vh] overflow-y-auto transition-all scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
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
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Books</DialogTitle>
            </DialogHeader>
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
            </div>
          </DialogContent>
        </Dialog>
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
      {!loading && books.length === 0 && (
        <div className="text-center text-gray-500">No books found.</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map(book => (
          <div key={book._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <button
                onClick={() => toggleFavorite(book._id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
              >
                <Star
                  className={`w-5 h-5 ${book.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
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
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedBook(book)}
                className="flex-1 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
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

      {/* Book Details Dialog */}
      <Dialog open={selectedBook !== null} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewMode === 'details' ? 'Book Details' : 'Reading View'}</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            viewMode === 'details' ? (
              <div className="p-4 space-y-4">
                <div className="flex gap-4">
                  <img
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    className="w-32 h-48 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{selectedBook.title}</h2>
                    <p className="text-gray-600">{selectedBook.author}</p>
                    <div className="flex gap-1 mt-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < (selectedBook.rating?.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          onClick={() => updateBook(selectedBook._id, { rating: { averageRating: i + 1, totalRatings: 1 } })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Notes</h3>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={selectedBook.notes || ''}
                    onChange={(e) => updateBook(selectedBook._id, { notes: e.target.value })}
                    placeholder="Add your notes..."
                    rows={4}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedBook.tags || []).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                  <button className="px-2 py-1 border rounded-full text-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setViewMode('reading')}
                  className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                  Read Book
                </button>
              </div>
            ) : (
              <ReadingView book={selectedBook} />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookLibrary;