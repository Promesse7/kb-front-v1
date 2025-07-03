import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Star, BookOpen, Filter, Grid, List, Heart, Share2, Eye, ArrowRight } from 'lucide-react';
const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Local backend
    : 'https://kb-library.onrender.com';

const PublicBookShowcase = () => {
  const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Sample book data - you can replace this with your actual data
  const sampleBooks = [
    {
      id: 1,
      title: "The Tao of Warren Buffett",
      author: "Mary Buffett",
      category: "Finance",
      rating: 4.2,
      reviews: 1247,
      coverImage: "/api/placeholder/200/300",
      description: "A collection of Warren Buffett's most inspiring quotes and wisdom on investing and life.",
      publishYear: 2006,
      pages: 256,
      featured: true
    },
    {
      id: 2,
      title: "Warren Buffett Book of Investing Wisdom",
      author: "Robert L. Bloch",
      category: "Finance",
      rating: 3.8,
      reviews: 892,
      coverImage: "/api/placeholder/200/300",
      description: "Essential insights from the Oracle of Omaha on building wealth through smart investing.",
      publishYear: 2015,
      pages: 320,
      featured: true
    },
    {
      id: 3,
      title: "Essays of Warren Buffett",
      author: "Warren Buffett",
      category: "Finance",
      rating: 4.5,
      reviews: 2156,
      coverImage: "/api/placeholder/200/300",
      description: "Lessons for corporate America from the chairman of Berkshire Hathaway.",
      publishYear: 2013,
      pages: 352,
      featured: true
    },
    {
      id: 4,
      title: "The Warren Buffett Way",
      author: "Robert G. Hagstrom",
      category: "Biography",
      rating: 4.3,
      reviews: 1834,
      coverImage: "/api/placeholder/200/300",
      description: "Investment strategies of the world's greatest investor explained in detail.",
      publishYear: 2013,
      pages: 304,
      featured: false
    },
    {
      id: 5,
      title: "Money Making Skills by Warren Buffett",
      author: "Warren Buffett",
      category: "Finance",
      rating: 4.1,
      reviews: 967,
      coverImage: "/api/placeholder/200/300",
      description: "Practical money-making strategies and financial wisdom from Warren Buffett.",
      publishYear: 2020,
      pages: 288,
      featured: false
    }
  ];

  const categories = ['all', 'Finance', 'Biography', 'Business', 'Self-Help', 'Fiction'];

  useEffect(() => {
    setBooks(sampleBooks);
    setFilteredBooks(sampleBooks);
  }, []);

  useEffect(() => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);



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

  const toggleFavorite = (bookId) => {
    setFavorites(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

const renderStars = (rating) => {
  // Fallback in case rating or totalRatings is missing
  const totalRatings = rating?.totalRatings ?? 0;

  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < Math.floor(totalRatings)
          ? 'fill-yellow-400 text-yellow-400'
          : 'text-gray-300'
      }`}
    />
  ));
};


  const BookCard = ({ book, isLarge = false }) => (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${isLarge ? 'col-span-2 row-span-2' : ''}`}>
      <div className="relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isLarge ? 'h-80' : 'h-48'}`}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => toggleFavorite(book.id)}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${favorites.includes(book.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {book.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
      </div>
      
      <div className={`p-6 ${isLarge ? 'space-y-4' : 'space-y-3'}`}>
        <div>
          <h3 className={`font-bold text-gray-800 line-clamp-2 ${isLarge ? 'text-2xl' : 'text-lg'}`}>
            {book.title}
          </h3>
          <p className={`text-gray-600 ${isLarge ? 'text-lg' : 'text-sm'}`}>by {book.author}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(book.rating.totalRatings)}</div>
          <span className="text-sm text-gray-600">{book.rating.totalRatings}</span>
          <span className="text-sm text-gray-400">({book.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full">{book.category}</span>
          <span>{book.publishYear}</span>
          <span>{book.pages} pages</span>
        </div>
        
        {isLarge && (
          <p className="text-gray-700 line-clamp-3">{book.description}</p>
        )}
        
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setSelectedBook(book)}
            className="flex-1 bg-gradient-to-r from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Read Now
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const BookModal = ({ book, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-80 object-cover rounded-lg"
            />
            
            <div className="space-y-4">
              <div>
                <p className="text-lg text-gray-600">by {book.author}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">{renderStars(book.rating.totalRatings)}</div>
                  <span className="text-sm text-gray-600">{book.rating.totalRatings}</span>
                  <span className="text-sm text-gray-400">({book.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p className="font-medium">{book.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Published:</span>
                  <p className="font-medium">{book.publishYear}</p>
                </div>
                <div>
                  <span className="text-gray-500">Pages:</span>
                  <p className="font-medium">{book.pages}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-teal-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-teal-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Start Reading
                </button>
                
                <button className="w-full border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );

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


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                NovTok
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-80"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

       
        {/* All Books */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              All Books ({filteredBooks.length})
            </h2>
            <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Book Modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default PublicBookShowcase;