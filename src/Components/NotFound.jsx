// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react'; // or use any book icon you prefer

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col justify-center items-center px-6 text-center">
      <BookOpen className="h-16 w-16 text-teal-900 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="bg-teal-900 text-white px-6 py-2 rounded-lg shadow hover:bg-teal-800 transition"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
