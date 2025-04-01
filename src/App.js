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
import LandingPage from './Components/pages/LandingPage';
import BookUpload from './Components/BookUpload';
import BookReader from './Components/BookReader';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://kb-library.onrender.com";

    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          const token = localStorage.getItem('token');
          
          if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
    
          console.log("Checking auth status..."); // Debugging log
          console.log("Backend URL:", backendUrl);
    
          const response = await axios.get(`${backendUrl}/api/auth/check-status`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            params: { key: 'NsuG-TIYDKU' },
            withCredentials: true  // Add this if using cookies for auth
          });
    
          console.log("Auth Response:", response.data); // Debugging log
    
          setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
          console.error('Auth check failed:', error);
          
          if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Response Status:', error.response.status);
          } else if (error.request) {
            console.error('No response from server:', error.request);
          } else {
            console.error('Error Message:', error.message);
          }
    
          setIsAuthenticated(false);
          
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
         {/* Landing Page route */}
         <Route path="/" element={<LandingPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
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
