import { useState } from 'react';
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
  // Enhanced state management
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "/api/placeholder/120/180",
      shelf: "fantasy",
      status: "completed",
      rating: 4,
      notes: "Great adventure story",
      dateAdded: "2024-01-15",
      dateCompleted: "2024-02-20",
      tags: ["fantasy", "adventure", "classic"],
      progress: 100,
      favorite: true
    },
    // ... other books
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    shelf: [],
    rating: [],
    favorite: false
  });
  
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Book management functions
  const addBook = (newBook) => {
    setBooks(prev => [...prev, { ...newBook, id: Date.now() }]);
  };

  const updateBook = (id, updates) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ));
  };

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const toggleFavorite = (id) => {
    setBooks(prev => prev.map(book =>
      book.id === id ? { ...book, favorite: !book.favorite } : book
    ));
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
              {/* Filter options */}
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="space-x-2">
                  {['Reading', 'Completed', 'Want to Read'].map(status => (
                    <button
                      key={status}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFilters.status.includes(status)
                          ? 'bg-blue-500 text-white'
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          Add Book
        </button>
      </div>

      {/* Book Grid with Interactive Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map(book => (
          <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <button
                onClick={() => toggleFavorite(book.id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
              >
                <Star
                  className={`w-5 h-5 ${
                    book.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
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
                    className="h-full bg-blue-500 rounded-full transition-all"
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
                onClick={() => deleteBook(book.id)}
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
            <DialogTitle>Book Details</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="p-4 space-y-4">
              <div className="flex gap-4">
                <img
                  src={selectedBook.cover}
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
                        className={`w-5 h-5 ${
                          i < selectedBook.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => updateBook(selectedBook.id, { rating: i + 1 })}
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
                  onChange={(e) => updateBook(selectedBook.id, { notes: e.target.value })}
                  placeholder="Add your notes..."
                  rows={4}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedBook.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
                <button className="px-2 py-1 border rounded-full text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookLibrary;