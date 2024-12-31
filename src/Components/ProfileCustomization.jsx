import React, { useState, useEffect } from 'react';
import axios from 'axios';
import avatarDefault from '../Images/user-icon.png';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileCustomization = () => {
  const [profile, setProfile] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const availableInterests = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy',
    'Romance', 'Business', 'Self-Help', 'Biography', 'History',
    'Science', 'Technology', 'Arts', 'Poetry', 'Drama'
  ];
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); 
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(avatarDefault);  
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data);
        setSelectedInterests(response.data.readingPreferences);
        setAvatar(response.data.avatar);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);



 // Validate profile structure before sending
 const validateProfileData = (data) => {
  if (!data) return false;
  
  const requiredFields = [
    'notificationSettings',
    'privacySettings',
    'readingPreferences',
    'theme',
    'language'
  ];
  
  return requiredFields.every(field => {
    if (field === 'readingPreferences') {
      return Array.isArray(data[field]);
    }
    return data[field] !== undefined;
  });
};

 const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.avatar && response.data.avatar.data) {
        setAvatar(`data:${response.data.avatar.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(response.data.avatar.data)))}`);
      }
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error uploading avatar');
    }
  };

   const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  setSuccess(false);
  setLastUpdate(null);

  if (!validateProfileData(profile)) {
    setError('Invalid profile data structure');
    setIsLoading(false);
    return;
  }

  console.log('Sending profile data:', JSON.stringify(profile, null, 2));

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(
      'http://localhost:5000/api/auth/user',
      profile,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Request-ID': Date.now().toString()
        }
      }
    );

    if (response.status === 200) {
      setSuccess(true);
      setLastUpdate({
        timestamp: new Date().toISOString(),
        status: 'success',
        sentData: profile
      });

      console.log('Update successful, server returned status 200');
      toast.success('Update successful!');
    }

    console.log('Full server response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

  } catch (error) {
    let errorMessage = 'An error occurred while updating your profile';
    
    console.error('Update error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response) {
      if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      errorMessage = 'Unable to reach the server. Please check your connection';
    }

    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
    setProfile(prev => ({
      ...prev,
      readingPreferences: prev.readingPreferences.includes(interest)
        ? prev.readingPreferences.filter(i => i !== interest)
        : [...prev.readingPreferences, interest]
    }));
  };

  if (!profile) {
    return  <div className='flex justify-center items-center h-screen text-2xl '>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-100 p-8">
 <ToastContainer />
  

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}

        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"   
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </button>
        </div>


        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer"
              />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center text-white">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <form onSubmit={handleProfileUpdate} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 h-24 resize-none"
              />
            </div>
          </div>
        </form>

        {/* Reading Interests */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Reading Interests</h3>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${selectedInterests.includes(interest)
                    ? 'bg-teal-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {Object.entries(profile.notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        notificationSettings: {
                          ...profile.notificationSettings,
                          [key]: e.target.checked
                        }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-800"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            {Object.entries(profile.privacySettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        privacySettings: {
                          ...profile.privacySettings,
                          [key]: e.target.checked
                        }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-800"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleProfileUpdate}
            className="px-6 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-900"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomization;
