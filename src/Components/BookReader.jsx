import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Type, 
  Minus, 
  Plus,
  Maximize,
  Minimize,
  Bookmark
} from 'lucide-react';
import  Card from './ui/Card';

const BookReader = ({ bookId }) => {
  const [bookContent, setBookContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmark, setBookmark] = useState(null);

  // Theme configurations
  const themes = {
    light: {
      background: 'bg-white',
      text: 'text-gray-800',
      paper: 'bg-stone-50'
    },
    sepia: {
      background: 'bg-amber-50',
      text: 'text-gray-900',
      paper: 'bg-amber-100'
    },
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      paper: 'bg-gray-800'
    }
  };

  useEffect(() => {
    fetchBookContent();
  }, [bookId, currentPage]);

  const fetchBookContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/books/${bookId}/content?page=${currentPage}`);
      if (!response.ok) throw new Error('Failed to fetch book content');
      const data = await response.json();
      setBookContent(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    } else {
      setBookmark(currentPage);
      // Save bookmark to backend
      fetch(`/api/books/${bookId}/bookmark`, {
        method: 'POST',
        body: JSON.stringify({ page: currentPage }),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };

  const changePage = (direction) => {
    const newPage = currentPage + direction;
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  const adjustFontSize = (change) => {
    const newSize = fontSize + change;
    if (newSize >= 12 && newSize <= 24) {
      setFontSize(newSize);
    }
  };

  return (
    <div className={`min-h-screen ${themes[theme].background} transition-colors duration-300`}>
      {/* Top Controls */}
      <div className="fixed top-0 left-0 right-0 bg-opacity-90 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => changePage(-1)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className={`${themes[theme].text}`}>Page {currentPage}</span>
            <button
              onClick={() => changePage(1)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustFontSize(-1)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Type className="w-4 h-4" />
              <button
                onClick={() => adjustFontSize(1)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-2 rounded ${theme === 'sepia' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={toggleBookmark}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 
                ${bookmark === currentPage ? 'text-blue-500' : ''}`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reading Area */}
      <div className="pt-20 pb-16 px-4">
        <Card className={`max-w-4xl mx-auto p-8 ${themes[theme].paper} shadow-lg`}>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div
              className={`prose max-w-none ${themes[theme].text}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {bookContent}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-opacity-90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4 flex justify-between">
          <button
            onClick={() => changePage(-1)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <button
            onClick={() => changePage(1)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookReader;