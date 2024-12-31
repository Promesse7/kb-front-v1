import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookLibrary from './Components/BookLibraryDashboard';
import ProfileCustomization from './Components/ProfileCustomization';
import ReadingGoals from './Components/PersonalReadingGoals';
import AuthSystem from './Components/Authentication';
import ReadingTracker from './Components/ReadingProgressTracking';
import BookManagement from './Components/BookManagement';
import Achievements from './Components/AchievementSystem';
import ReadingHistory from './Components/ReadingHistory';
import BookUpload from './Components/BookUpload';
import BookReader from './Components/BookReader';

// Mock function to simulate checking user authentication status from the backend
const checkAuthStatus = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/check-status', {
      method: 'GET',
      credentials: 'include', // Include credentials
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Authentication status:', data);

    return data.isAuthenticated;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false; // Return false if there's an error
  }
};



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check authentication status when the app loads
    const fetchAuthStatus = async () => {
      const authStatus = await checkAuthStatus();
      setIsAuthenticated(authStatus);
    };
    fetchAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    // Optionally, show a loading indicator while authentication status is being fetched
    return <div className='flex justify-center items-center h-screen text-2xl text-gray-500 '>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <BookLibrary /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfileCustomization /> : <Navigate to="/auth" />}
        />
        <Route
          path="/reading-goals"
          element={isAuthenticated ? <ReadingGoals /> : <Navigate to="/auth" />}
        />
        <Route
          path="/reading-progress"
          element={isAuthenticated ? <ReadingTracker /> : <Navigate to="/auth" />}
        />
        <Route
        path="/achievements"
        element={isAuthenticated ? < Achievements/> : <Navigate to="/auth" />}
        />
        <Route
        path="/reading-history"
        element={isAuthenticated ? <ReadingHistory/> : <Navigate to="/auth" />}
        />
       <Route
       path="/book-management"
       element={isAuthenticated ? <BookManagement/> : <Navigate to="/auth" />}
       />
        <Route
       path="/book-upload"
       element={isAuthenticated ? <BookUpload/> : <Navigate to="/auth" />}
       />
           <Route
       path="/book-reader"
       element={isAuthenticated ? <BookReader/> : <Navigate to="/auth" />}
       />

        {/* Public Route */}
        <Route path="/auth" element={<AuthSystem />} />
      </Routes>
    </Router>
  );
}

export default App;
