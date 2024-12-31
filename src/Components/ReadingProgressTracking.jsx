import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Clock, Calendar, Award, ChevronRight, TrendingUp } from 'lucide-react';

const ReadingTracker = () => {
  const [currentYear] = useState(2024);
  const [yearlyGoal] = useState(52); // 52 books per year
  
  const [booksInProgress] = useState([
    {
      id: 1,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      currentPage: 156,
      totalPages: 256,
      startDate: "2024-12-15",
      lastRead: "2024-12-21",
      coverImage: "/api/placeholder/80/120"
    },
    {
      id: 2,
      title: "Company of One",
      author: "Paul Jarvis",
      currentPage: 89,
      totalPages: 240,
      startDate: "2024-12-18",
      lastRead: "2024-12-22",
      coverImage: "/api/placeholder/80/120"
    }
  ]);

  const monthlyReadingData = [
    { month: 'Jan', books: 4 },
    { month: 'Feb', books: 3 },
    { month: 'Mar', books: 5 },
    { month: 'Apr', books: 4 },
    { month: 'May', books: 6 },
    { month: 'Jun', books: 3 },
    { month: 'Jul', books: 4 },
    { month: 'Aug', books: 5 },
    { month: 'Sep', books: 4 },
    { month: 'Oct', books: 3 },
    { month: 'Nov', books: 4 },
    { month: 'Dec', books: 2 }
  ];

  const totalBooksRead = monthlyReadingData.reduce((acc, curr) => acc + curr.books, 0);
  const progressPercentage = (totalBooksRead / yearlyGoal) * 100;

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Year Goal */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Reading Progress</h1>
            <div className="text-gray-600">
              <span className="font-medium">{currentYear}</span> Reading Goal
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold text-teal-800">{totalBooksRead}</span>
                <span className="text-gray-600 ml-2">of {yearlyGoal} books read</span>
              </div>
              <span className="text-gray-600">{progressPercentage.toFixed(1)}% complete</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-800 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currently Reading */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Currently Reading</h2>
          <div className="space-y-6">
            {booksInProgress.map(book => (
              <div key={book.id} className="flex gap-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                    </div>
                    <button className="text-teal-800 hover:text-teal-900">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  
                  {/* Reading Progress */}
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Page {book.currentPage} of {book.totalPages}</span>
                      <span>{((book.currentPage / book.totalPages) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-800 rounded-full"
                        style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Last Read */}
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-1" />
                    Last read {new Date(book.lastRead).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading Stats */}
        <div className="grid grid-cols-2 gap-6">
          {/* Monthly Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Monthly Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyReadingData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="books" fill="#115e59" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reading Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-teal-800" size={20} />
                </div>
                <span className="text-gray-600">Total Pages</span>
              </div>
              <div className="text-2xl font-bold">2,456</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-teal-800" size={20} />
                </div>
                <span className="text-gray-600">Reading Time</span>
              </div>
              <div className="text-2xl font-bold">86h</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-teal-800" size={20} />
                </div>
                <span className="text-gray-600">Daily Average</span>
              </div>
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-gray-600">pages/day</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Award className="text-teal-800" size={20} />
                </div>
                <span className="text-gray-600">Streak</span>
              </div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTracker;