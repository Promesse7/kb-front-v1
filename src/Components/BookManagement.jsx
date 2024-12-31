import { useState } from 'react';
import { BookOpen, Library, ListPlus, FolderPlus, BookMarked, Edit, Trash2, Plus, Check, Star } from 'lucide-react';

// Personal Bookshelf Component
const PersonalBookshelf = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "/api/placeholder/120/180",
      shelf: "fantasy",
      status: "completed"
    },
    {
      id: 2,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "/api/placeholder/120/180",
      shelf: "classics",
      status: "reading"
    },
    {
      id: 2,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "/api/placeholder/120/180",
      shelf: "classics",
      status: "reading"
    },
    {
      id: 2,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "/api/placeholder/120/180",
      shelf: "classics",
      status: "reading"
    }
  ]);

  const [shelves] = useState(['All Books', 'Favorites', 'Fantasy', 'Classics', 'Non-Fiction']);
  const [selectedShelf, setSelectedShelf] = useState('All Books');

  const filteredBooks = selectedShelf === 'All Books' 
    ? books 
    : books.filter(book => book.shelf.toLowerCase() === selectedShelf.toLowerCase());

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Library className="w-6 h-6 text-blue-500" />
        Personal Bookshelf
      </h2>

      {/* Shelf Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {shelves.map(shelf => (
          <button
            key={shelf}
            onClick={() => setSelectedShelf(shelf)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedShelf === shelf
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {shelf}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredBooks.map(book => (
          <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-gray-800 line-clamp-1">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Collections Component
const CustomCollections = () => {
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "Summer Reading 2024",
      description: "Books to read during summer vacation",
      books: [
        { id: 1, title: "Beach Read", author: "Emily Henry" },
        { id: 2, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid" }
      ]
    },
    {
      id: 2,
      name: "Mystery Favorites",
      description: "Best detective and mystery novels",
      books: [
        { id: 3, title: "The Silent Patient", author: "Alex Michaelides" }
      ]
    }
  ]);

  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });

  const addCollection = () => {
    if (newCollection.name.trim()) {
      setCollections(prev => [...prev, {
        id: Date.now(),
        name: newCollection.name,
        description: newCollection.description,
        books: []
      }]);
      setNewCollection({ name: '', description: '' });
      setIsAddingCollection(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ListPlus className="w-6 h-6 text-purple-500" />
          Custom Collections
        </h2>
        <button
          onClick={() => setIsAddingCollection(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          <FolderPlus className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {/* Add Collection Form */}
      {isAddingCollection && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <input
            type="text"
            placeholder="Collection Name"
            className="w-full p-2 mb-2 border rounded"
            value={newCollection.name}
            onChange={e => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            className="w-full p-2 mb-2 border rounded"
            value={newCollection.description}
            onChange={e => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex gap-2">
            <button
              onClick={addCollection}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Create Collection
            </button>
            <button
              onClick={() => setIsAddingCollection(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid gap-4">
        {collections.map(collection => (
          <div key={collection.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{collection.name}</h3>
                <p className="text-gray-600 text-sm">{collection.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {collection.books.length} books
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reading Status Component
const ReadingStatus = () => {
  const [statusSections] = useState([
    { id: 'reading', name: 'Currently Reading', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'wantToRead', name: 'Want to Read', icon: <Plus className="w-5 h-5" /> },
    { id: 'completed', name: 'Completed', icon: <Check className="w-5 h-5" /> }
  ]);

  const [books, setBooks] = useState({
    reading: [
      { id: 1, title: "Project Hail Mary", author: "Andy Weir", progress: 45 },
      { id: 2, title: "Atomic Habits", author: "James Clear", progress: 72 }
    ],
    wantToRead: [
      { id: 3, title: "The Midnight Library", author: "Matt Haig" },
      { id: 4, title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin" }
    ],
    completed: [
      { id: 5, title: "The Thursday Murder Club", author: "Richard Osman", rating: 4 }
    ]
  });

  const updateStatus = (bookId, fromStatus, toStatus) => {
    setBooks(prev => {
      const updatedBooks = { ...prev };
      const bookToMove = updatedBooks[fromStatus].find(b => b.id === bookId);
      updatedBooks[fromStatus] = updatedBooks[fromStatus].filter(b => b.id !== bookId);
      updatedBooks[toStatus] = [...updatedBooks[toStatus], bookToMove];
      return updatedBooks;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookMarked className="w-6 h-6 text-green-500" />
        Reading Status
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {statusSections.map(section => (
          <div key={section.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gray-100 rounded-full">
                {section.icon}
              </div>
              <h3 className="font-semibold">{section.name}</h3>
              <span className="ml-auto bg-gray-100 px-2 py-1 rounded text-sm">
                {books[section.id].length}
              </span>
            </div>

            <div className="space-y-3">
              {books[section.id].map(book => (
                <div key={book.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  
                  {book.progress && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{book.progress}%</span>
                    </div>
                  )}
                  
                  {book.rating && (
                    <div className="flex gap-1 mt-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${
                            i < book.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const BookManagement = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <PersonalBookshelf />
      <CustomCollections />
      <ReadingStatus />
    </div>
  );
};

export default BookManagement;