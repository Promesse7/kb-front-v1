import { useState } from 'react';
import { Award, Book, BookOpen, BookCheck, Trophy, Star, Flame } from 'lucide-react';

const AchievementSystem = () => {
  const [booksRead, setBooksRead] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const badges = [
    {
      id: 1,
      name: "Bookworm Beginner",
      description: "Read your first book",
      icon: <Book className="w-8 h-8" />,
      requirement: 1,
      type: 'books',
      color: 'text-blue-500'
    },
    {
      id: 2,
      name: "Book Explorer",
      description: "Read 5 books",
      icon: <BookOpen className="w-8 h-8" />,
      requirement: 5,
      type: 'books',
      color: 'text-green-500'
    },
    {
      id: 3,
      name: "Reading Master",
      description: "Read 10 books",
      icon: <BookCheck className="w-8 h-8" />,
      requirement: 10,
      type: 'books',
      color: 'text-purple-500'
    },
    {
      id: 4,
      name: "Reading Streak",
      description: "7-day reading streak",
      icon: <Flame className="w-8 h-8" />,
      requirement: 7,
      type: 'streak',
      color: 'text-orange-500'
    },
    {
      id: 5,
      name: "Time Champion",
      description: "Read for 10 hours",
      icon: <Trophy className="w-8 h-8" />,
      requirement: 10,
      type: 'time',
      color: 'text-yellow-500'
    }
  ];

  const isUnlocked = (badge) => {
    switch (badge.type) {
      case 'books':
        return booksRead >= badge.requirement;
      case 'streak':
        return streakDays >= badge.requirement;
      case 'time':
        return readingTime >= badge.requirement;
      default:
        return false;
    }
  };

  // Mock functions to simulate progress
  const addBook = () => setBooksRead(prev => prev + 1);
  const addStreak = () => setStreakDays(prev => prev + 1);
  const addReadingTime = () => setReadingTime(prev => prev + 1);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-8 h-8 text-blue-500" />
          Reading Achievements
        </h1>
        
        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-gray-600">Books Read</div>
            <div className="text-2xl font-bold text-blue-600">{booksRead}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="font-semibold text-gray-600">Day Streak</div>
            <div className="text-2xl font-bold text-orange-600">{streakDays}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="font-semibold text-gray-600">Hours Read</div>
            <div className="text-2xl font-bold text-yellow-600">{readingTime}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2 mb-8">
          <button 
            onClick={addBook}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Book
          </button>
          <button 
            onClick={addStreak}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Streak Day
          </button>
          <button 
            onClick={addReadingTime}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Add Reading Hour
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isUnlocked(badge) 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={badge.color}>{badge.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
              {isUnlocked(badge) && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Star className="w-4 h-4" />
                  Unlocked!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;