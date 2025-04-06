import React, { useState,useEffect } from 'react';
import axios from 'axios';
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
import Card from './ui/Card';

const BookReader = ({ book }) => {  

  const [currentPage, setCurrentPage] = useState(1); // Page 1 corresponds to chapter[0]
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
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
      text: 'text-gray-900',
      paper: 'bg-gray-850'
    }
  };

  // Get the total number of chapters
  const totalChapters = book.chapters.length;

  // Get the content of the current chapter
  const currentChapter = book.chapters[currentPage - 1]; // Subtract 1 because currentPage is 1-based

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
      // Optionally, you could save this to local storage or a backend if needed
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
            <span className={`${themes[theme].text}`}>Chapter {currentPage} of {totalChapters}</span>
            <button
              onClick={() => changePage(1)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              disabled={currentPage === totalChapters}
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
                ${bookmark === currentPage ? 'text-teal-500' : ''}`}
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
      <div className="pt-20 pb-16 px-4 h-screen w-[80vw] mx-auto overflow-y-auto custom-scrollbar">
        <Card className={`max-w-4xl mx-auto p-14 m-4 ${themes[theme].paper} shadow-lg`}>
          <h2 className={`${themes[theme].text} text-xl text-center mt-2 font-bold mb-4`}>
            {currentChapter.title}
          </h2>
          <div
            className={`mx-8 text-left prose max-w-none ${themes[theme].text}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {currentChapter.content}
          </div>
        </Card>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-opacity-90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-2 flex justify-between">
          <button
            onClick={() => changePage(-1)}
            className="px-4 py-2 rounded bg-teal-800 text-white hover:bg-teal-900"
            disabled={currentPage === 1}
          >
            Previous Chapter
          </button>
          <button
            onClick={() => changePage(1)}
            className="px-4 py-2 rounded bg-teal-800 text-white hover:bg-teal-900"
            disabled={currentPage === totalChapters}
          >
            Next Chapter
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookReader;