import React, { useState, useEffect } from 'react';
import Card from '../Components/ui/Card';
import CardHeader from '../Components/ui/CardHeader';
import CardTitle from '../Components/ui/CardTitle';
import CardContent from '../Components/ui/CardContent';
import Alert from '../Components/ui/Alert';
import AlertDescription from '../Components/ui/AlertDescription';
import axios from "axios";
import { Plus, Minus, Save, Image as ImageIcon, Loader2, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const BookUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    category: 'Fiction',
    publicationYear: new Date().getFullYear(),
    publisher: '',
    language: 'English',
    chapters: [
      {
        title: '',
        content: '',
        chapterNumber: 1
      }
    ],
    coverImage: ''
  });
  const navigate = useNavigate();

  const backendUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000" // Local backend
      : 'https://kb-library.onrender.com';

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology',
    'History', 'Biography', 'Romance', 'Business', 'Self-Help',
    'Arts', 'Poetry', 'Drama',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChapterChange = (index, field, value) => {
    setFormData(prev => {
      const newChapters = [...prev.chapters];
      newChapters[index] = {
        ...newChapters[index],
        [field]: value
      };
      return {
        ...prev,
        chapters: newChapters
      };
    });
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          title: '',
          content: '',
          chapterNumber: prev.chapters.length + 1
        }
      ]
    }));
  };

  const removeChapter = (index) => {
    if (formData.chapters.length === 1) {
      setError("Cannot remove the last chapter");
      return;
    }

    setFormData(prev => {
      const newChapters = prev.chapters.filter((_, i) => i !== index)
        .map((chapter, i) => ({
          ...chapter,
          chapterNumber: i + 1
        }));
      return {
        ...prev,
        chapters: newChapters
      };
    });
  };



  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Cover image size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const timestamp = Math.round(new Date().getTime() / 1000);
      const formData = new FormData();

      // Essential Cloudinary parameters
      formData.append('file', file);
      formData.append('upload_preset', 'hb-library');
      formData.append('cloud_name', 'dlhu0vkqm');
      formData.append('folder', 'book-covers');
      formData.append('timestamp', timestamp);

      // Log the form data for debugging
      console.log('Upload parameters:', {
        file: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadPreset: 'hb-library',
        cloudName: 'dlhu0vkqm',
        folder: 'book-covers',
        timestamp
      });

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dlhu0vkqm/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload progress:', percentCompleted);
          },
        }
      );

      if (response.data && response.data.secure_url) {
        setImagePreview(response.data.secure_url);
        setFormData(prev => ({
          ...prev,
          coverImage: response.data.secure_url,
        }));
        setError(null);
      } else {
        throw new Error('Invalid response from Cloudinary');
      }
    } catch (error) {
      // Enhanced error logging
      console.error('Upload error details:', {
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message
      });

      if (error.response?.data?.error) {
        // Log the specific error message from Cloudinary
        console.error('Cloudinary error:', error.response.data.error);
        setError(`Upload failed: ${error.response.data.error.message}`);
      } else if (error.response?.status === 400) {
        setError('Invalid upload parameters. Please check the file and try again.');
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }));
    setImagePreview(null);
  };

  // 1. First, let's modify your handleSubmit to properly set the headers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.title || !formData.author || !formData.isbn) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.chapters.some(chapter => !chapter.title || !chapter.content)) {
        setError('All chapters must have both title and content');
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'chapters') {
          if (key === 'coverImage' && formData[key] === null) {
            return;
          }
          submitData.append(key, formData[key]);
        }
      });
      submitData.append('chapters', JSON.stringify(formData.chapters));

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      console.log('Token being sent:', token);

      const response = await fetch(`${backendUrl}/api/upload-book`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload book');
      }

      setSuccess(true);
      resetForm();

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'An error occurred while uploading the book');
    } finally {
      setLoading(false);
    }
  };



  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      isbn: '',
      category: 'Fiction',
      publicationYear: new Date().getFullYear(),
      publisher: '',
      language: 'English',
      chapters: [{ title: '', content: '', chapterNumber: 1 }],
      coverImage: null
    });
    setImagePreview(null);
  };




  return (
    <div className='m-4 rounded-lg overflow-y-auto h-[80vh]'>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex items-center justify-between gap-2  ">
          <CardTitle className="flex items-center gap-2 justify-between group hover:cursor-pointer">
            <div className='flex  items-center gap-2'>
              <div className='flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1 cursor-pointer' onClick={() => navigate(-1)} >
              <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </div>
              <div className='ml-[40%] flex items-center gap-2'>
                <Save className="w-8 h-6 text-gray-400 group-hover:fill-gray-600" />
                <span className=' text-2xl'>Create New Book</span>
              </div>
            </div>

          </CardTitle>

        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Upload */}
            <div className="border-2 border-dashed rounded-lg p-6">
              <div className="flex flex-col items-center space-y-2">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="max-h-48 rounded"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                      Choose cover image
                      <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500">Optional, max 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Book Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Book Title"
                className="border rounded p-2 w-full"
                required
              />
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author"
                className="border rounded p-2 w-full"
                required
              />
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                placeholder="ISBN"
                className="border rounded p-2 w-full"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                min="1800"
                max={new Date().getFullYear()}
                required
              />
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                placeholder="Publisher"
                className="border rounded p-2 w-full"
                required
              />
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                placeholder="Language"
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Book Description"
              className="border rounded p-2 w-full h-32"
              required
            />

            {/* Chapters Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chapters</h3>
                <button
                  type="button"
                  onClick={addChapter}
                  className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-4 h-4" />
                  Add Chapter
                </button>
              </div>

              {formData.chapters.map((chapter, index) => (
                <div key={index} className="space-y-4 p-4 border rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Chapter {chapter.chapterNumber}</h4>
                    <button
                      type="button"
                      onClick={() => removeChapter(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                    placeholder="Chapter Title"
                    className="border rounded p-2 w-full"
                    required
                  />

                  <textarea
                    value={chapter.content}
                    onChange={(e) => handleChapterChange(index, 'content', e.target.value)}
                    placeholder="Chapter Content"
                    className="border rounded p-2 w-full h-48"
                    required
                  />
                </div>
              ))}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-700 border-green-200">
                <AlertDescription>Book created successfully!</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Saving...' : 'Save Book'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

  );
};

export default BookUpload;