import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, BookOpen, Clock, Calendar, Plus, Edit2, Trash2, CheckCircle, X } from 'lucide-react';

const ReadingGoals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      type: 'books',
      target: 52,
      timeframe: 'yearly',
      current: 23,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'in-progress'
    },
    {
      id: 2,
      type: 'pages',
      target: 5000,
      timeframe: 'monthly',
      current: 2100,
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      status: 'in-progress'
    },
    {
      id: 3,
      type: 'time',
      target: 30,
      timeframe: 'weekly',
      current: 12,
      startDate: '2024-12-18',
      endDate: '2024-12-24',
      status: 'in-progress'
    }
  ]);

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'books',
    target: '',
    timeframe: 'yearly',
    startDate: '',
    endDate: ''
  });

  const progressData = [
    { week: 'Week 1', actual: 3, target: 4 },
    { week: 'Week 2', actual: 5, target: 4 },
    { week: 'Week 3', actual: 4, target: 4 },
    { week: 'Week 4', actual: 6, target: 4 }
  ];

  const getGoalIcon = (type) => {
    switch (type) {
      case 'books':
        return <BookOpen size={20} />;
      case 'pages':
        return <Target size={20} />;
      case 'time':
        return <Clock size={20} />;
      default:
        return <Target size={20} />;
    }
  };

  const getProgressPercentage = (current, target) => {
    return (current / target) * 100;
  };

  const formatGoalValue = (type, value) => {
    switch (type) {
      case 'books':
        return `${value} books`;
      case 'pages':
        return `${value} pages`;
      case 'time':
        return `${value} minutes`;
      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reading Goals</h1>
          <button
            onClick={() => setShowNewGoalForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-900"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>

        {/* New Goal Form */}
        {showNewGoalForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Goal</h2>
              <button
                onClick={() => setShowNewGoalForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Type</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                >
                  <option value="books">Number of Books</option>
                  <option value="pages">Pages Read</option>
                  <option value="time">Reading Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                  placeholder="Enter target value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timeframe</label>
                <select
                  value={newGoal.timeframe}
                  onChange={(e) => setNewGoal({...newGoal, timeframe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={newGoal.startDate}
                  onChange={(e) => setNewGoal({...newGoal, startDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewGoalForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-900"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Goals */}
        <div className="grid grid-cols-3 gap-6">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-800">
                    {getGoalIcon(goal.type)}
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{goal.timeframe} Goal</h3>
                    <p className="text-sm text-gray-600">{formatGoalValue(goal.type, goal.target)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatGoalValue(goal.type, goal.current)}</span>
                  <span>{getProgressPercentage(goal.current, goal.target).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-800 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#115e59" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { title: "Weekly Streak", desc: "Read every day for a week", complete: true },
              { title: "Page Master", desc: "Read 1000 pages in a month", complete: true },
              { title: "Book Worm", desc: "Complete 5 books", complete: false }
            ].map((achievement, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.complete ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingGoals;