import { useState } from 'react';
import { BookOpen, Calendar, Star, Clock, ArrowUpDown, Search } from 'lucide-react';

const ReadingHistory = () => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock reading history data
  const [readingHistory, setReadingHistory] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      dateCompleted: "2024-12-20",
      rating: 4,
      pagesRead: 180,
      totalPages: 180,
      status: "completed",
      timeSpent: "5h 30m",
      coverImage: "/api/placeholder/120/180"
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      dateCompleted: "2024-12-15",
      rating: 5,
      pagesRead: 328,
      totalPages: 328,
      status: "completed",
      timeSpent: "8h 15m",
      coverImage: "/api/placeholder/120/180"
    },
    {
      id: 3,
      title: "Dune",
      author: "Frank Herbert",
      dateCompleted: null,
      rating: null,
      pagesRead: 320,
      totalPages: 412,
      status: "in-progress",
      timeSpent: "6h 45m",
      coverImage: "/api/placeholder/120/180"
    }
  ]);

  const filterBooks = () => {
    let filtered = [...readingHistory];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(book => book.status === selectedFilter);
    }

    // Apply sort
    filtered.sort((a, b) => {
      const dateA = a.dateCompleted ? new Date(a.dateCompleted) : new Date();
      const dateB = b.dateCompleted ? new Date(b.dateCompleted) : new Date();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`w-4 h-4 ${
          index < (rating || 0) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getProgressColor = (pagesRead, totalPages) => {
    const progress = (pagesRead / totalPages) * 100;
    if (progress === 100) return 'bg-green-500';
    if (progress > 50) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-500" />
          Reading History
        </h1>
        <p className="text-gray-600">Track your reading journey and progress</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search books or authors..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All Books</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
        </select>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Reading History List */}
      <div className="space-y-4">
        {filterBooks().map((book) => (
          <div key={book.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
            {/* Book Cover */}
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-24 h-36 object-cover rounded"
            />

            {/* Book Details */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  book.status === 'completed' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {book.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full ${getProgressColor(book.pagesRead, book.totalPages)}`}
                    style={{ width: `${(book.pagesRead / book.totalPages) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {book.pagesRead} of {book.totalPages} pages
                </p>
              </div>

              {/* Additional Details */}
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {book.dateCompleted || 'In Progress'}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {book.timeSpent}
                </div>
                {book.rating && (
                  <div className="flex items-center gap-1">
                    {getRatingStars(book.rating)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingHistory;