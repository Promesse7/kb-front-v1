import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import DashBoard from './Components/BookLibraryDashboard';
import BookLibrary from './Components/BookLibrary';
import ProfileCustomization from './Components/ProfileCustomization';
import ReadingGoals from './Components/PersonalReadingGoals';
import AuthSystem from './Components/Authentication';
import ReadingTracker from './Components/ReadingProgressTracking';
import BookManagement from './Components/BookManagement';
import Achievements from './Components/AchievementSystem';
import ReadingHistory from './Components/ReadingHistory';
import BookUpload from './Components/BookUpload';
import BookReader from './Components/BookReader';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://api.render.com/deploy/srv-ctqdhobqf0us73elrd40";

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${backendUrl}/api/auth/check-status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            key: 'NsuG-TIYDKU'
          }
        });

        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        
        // Clear token if it's invalid
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [backendUrl]);

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen text-2xl text-gray-500">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }
    
    return children;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashBoard />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileCustomization />
          </ProtectedRoute>
        } />
        
        <Route path="/reading-goals" element={
          <ProtectedRoute>
            <ReadingGoals />
          </ProtectedRoute>
        } />
        
        <Route path="/reading-progress" element={
          <ProtectedRoute>
            <ReadingTracker />
          </ProtectedRoute>
        } />
        
        <Route path="/achievements" element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        } />
        
        <Route path="/reading-history" element={
          <ProtectedRoute>
            <ReadingHistory />
          </ProtectedRoute>
        } />
        
        <Route path="/book-management" element={
          <ProtectedRoute>
            <BookManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/book-upload" element={
          <ProtectedRoute>
            <BookUpload />
          </ProtectedRoute>
        } />
        
        <Route path="/book-reader" element={
          <ProtectedRoute>
            <BookReader />
          </ProtectedRoute>
        } />
        
        <Route path="/book-library" element={
          <ProtectedRoute>
            <BookLibrary />
          </ProtectedRoute>
        } />

        {/* Public Route */}
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/" /> : <AuthSystem />
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
