import React, { useState, useEffect } from 'react';
import { Star, Lock, Trophy, User, BookOpen, Gamepad2, Puzzle, MousePointer, Play, Award, Zap, ChevronRight, Home, Settings, CheckCircle, XCircle, ArrowRight, RotateCcw, Volume2 } from 'lucide-react';

const GamifiedLearningApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameState, setGameState] = useState({});
  
  // Load from localStorage or use defaults
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('learningAppProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Adventure Learner',
      avatar: '🦸‍♂️',
      totalXP: 350,
      streak: 5,
      badges: ['first_login', 'quick_learner', 'math_master'],
      completedModules: ['numbers', 'shapes', 'letters']
    };
  });

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem('learningAppProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Sound effects
  const playSound = (type) => {
    const sounds = {
      click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmoeADqX4O3aeSMFKITB8t6LSQ==',
      success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmoeADqX4O3aeSMFKITB8t6LSQ==',
      error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmoeADqX4O3aeSMFKITB8t6LSQ=='
    };
    
    if (sounds[type]) {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if sound fails
    }
  };

  const levels = [
    {
      id: 1,
      title: 'Starter Explorer',
      subtitle: 'Begin Your Journey',
      unlocked: true,
      completion: 85,
      bgColor: 'from-green-400 to-blue-500',
      icon: '🌟',
      xpRequired: 0
    },
    {
      id: 2,
      title: 'Junior Challenger',
      subtitle: 'Level Up Your Skills',
      unlocked: userProfile.totalXP >= 500,
      completion: 0,
      bgColor: 'from-purple-400 to-pink-500',
      icon: '🚀',
      xpRequired: 500
    },
    {
      id: 3,
      title: 'Brain Hero',
      subtitle: 'Master the Knowledge',
      unlocked: userProfile.totalXP >= 1000,
      completion: 0,
      bgColor: 'from-orange-400 to-red-500',
      icon: '👑',
      xpRequired: 1000
    }
  ];

  const subjects = [
    {
      id: 'math',
      name: 'Math',
      icon: '🔢',
      color: 'bg-blue-500',
      modules: [
        { 
          id: 'numbers', 
          title: 'Numbers 1-10', 
          completed: userProfile.completedModules.includes('numbers'), 
          xp: 50,
          content: {
            doc: { title: 'Learn Numbers', text: 'Numbers help us count things! Let\'s learn 1 to 10.', visual: '🔢' },
            story: { title: 'Number Adventure', text: 'Join Captain Count on a journey through Number Land!', character: '👨‍🚀' },
            choice: { title: 'Number Detective', text: 'Help solve the mystery of the missing numbers!', icon: '🔍' },
            drag: { title: 'Number Sorting', text: 'Drag numbers to their correct positions!', items: ['1', '2', '3', '4', '5'] }
          }
        },
        { 
          id: 'shapes', 
          title: 'Basic Shapes', 
          completed: userProfile.completedModules.includes('shapes'), 
          xp: 50,
          content: {
            doc: { title: 'Discover Shapes', text: 'Shapes are everywhere! Circles, squares, triangles...', visual: '🔺' },
            story: { title: 'Shape Kingdom', text: 'Visit the magical kingdom where shapes come alive!', character: '👸' },
            choice: { title: 'Shape Builder', text: 'Choose shapes to build amazing structures!', icon: '🏗️' },
            drag: { title: 'Shape Puzzle', text: 'Match shapes to their shadows!', items: ['○', '□', '△', '◇'] }
          }
        },
        { 
          id: 'counting', 
          title: 'Counting Games', 
          completed: userProfile.completedModules.includes('counting'), 
          xp: 50,
          content: {
            doc: { title: 'Count Everything', text: 'Practice counting with fun objects and animals!', visual: '🦆' },
            story: { title: 'Counting Safari', text: 'Go on safari and count all the animals you see!', character: '🦁' },
            choice: { title: 'Count & Choose', text: 'Count the items and pick the right answer!', icon: '🎯' },
            drag: { title: 'Counting Match', text: 'Drag numbers to match the quantity!', items: ['🍎', '🍎🍎', '🍎🍎🍎'] }
          }
        }
      ]
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: '📚',
      color: 'bg-green-500',
      modules: [
        { 
          id: 'letters', 
          title: 'ABC Letters', 
          completed: userProfile.completedModules.includes('letters'), 
          xp: 50,
          content: {
            doc: { title: 'Letter Land', text: 'Every letter has a sound and a story!', visual: '🅰️' },
            story: { title: 'Alphabet Adventure', text: 'Meet the letter characters on their journey!', character: '🦸‍♀️' },
            choice: { title: 'Letter Detective', text: 'Find the missing letters in words!', icon: '🔤' },
            drag: { title: 'Letter Match', text: 'Match uppercase and lowercase letters!', items: ['A', 'B', 'C', 'D'] }
          }
        },
        { 
          id: 'words', 
          title: 'First Words', 
          completed: userProfile.completedModules.includes('words'), 
          xp: 50,
          content: {
            doc: { title: 'Word World', text: 'Letters come together to make words!', visual: '📝' },
            story: { title: 'Word Wizard', text: 'Help the wizard create magical words!', character: '🧙‍♂️' },
            choice: { title: 'Word Builder', text: 'Choose letters to build words!', icon: '🔨' },
            drag: { title: 'Word Puzzle', text: 'Drag letters to spell words!', items: ['C', 'A', 'T'] }
          }
        },
        { 
          id: 'sentences', 
          title: 'Simple Sentences', 
          completed: userProfile.completedModules.includes('sentences'), 
          xp: 50,
          content: {
            doc: { title: 'Sentence Stories', text: 'Words join together to tell stories!', visual: '📖' },
            story: { title: 'Sentence Safari', text: 'Build sentences about jungle animals!', character: '🐅' },
            choice: { title: 'Sentence Builder', text: 'Choose words to make sentences!', icon: '⚡' },
            drag: { title: 'Sentence Order', text: 'Put words in the right order!', items: ['The', 'cat', 'runs'] }
          }
        }
      ]
    },
     {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'bg-purple-500',
    modules: [
      {
        id: 'plants',
        title: 'Plants & Growth',
        completed: userProfile.completedModules.includes('plants'),
        xp: 50,
        content: {
          doc: { title: 'Plant Power', text: 'Plants grow from seeds with water and sunlight!', visual: '🌱' },
          story: { title: 'Sunny the Sunflower', text: 'Follow Sunny from seed to bloom!', character: '🌻' },
          choice: { title: 'Grow It Right', text: 'Choose what plants need to grow.', icon: '☀️' },
          drag: { title: 'Plant Parts', text: 'Drag labels to parts of a plant.', items: ['Leaf', 'Stem', 'Root'] }
        }
      },
      {
        id: 'animals',
        title: 'Animal World',
        completed: userProfile.completedModules.includes('animals'),
        xp: 50,
        content: {
          doc: { title: 'Animal Kingdom', text: 'Animals come in all shapes and sizes!', visual: '🦓' },
          story: { title: 'Zara the Zookeeper', text: 'Help Zara take care of the animals!', character: '👩‍🌾' },
          choice: { title: 'Find the Animal', text: 'Choose the animal that fits the clues.', icon: '🔎' },
          drag: { title: 'Habitat Match', text: 'Match animals to where they live.', items: ['Jungle', 'Ocean', 'Farm'] }
        }
      },
      {
        id: 'weather',
        title: 'Weather & Seasons',
        completed: userProfile.completedModules.includes('weather'),
        xp: 50,
        content: {
          doc: { title: 'Weather Watch', text: 'Learn about rain, sun, snow, and wind!', visual: '⛅' },
          story: { title: 'Captain Climate', text: 'Travel through the seasons with Captain Climate!', character: '🧑‍✈️' },
          choice: { title: 'What’s the Weather?', text: 'Pick the correct weather based on clues.', icon: '🌦️' },
          drag: { title: 'Season Sort', text: 'Sort pictures into the right seasons.', items: ['🌸', '☀️', '🍂', '❄️'] }
        }
      }
    ]
  },

  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    color: 'bg-pink-500',
    modules: [
      {
        id: 'colors',
        title: 'Colors & Mixing',
        completed: userProfile.completedModules.includes('colors'),
        xp: 50,
        content: {
          doc: { title: 'Color Fun', text: 'Let’s learn red, blue, yellow, and more!', visual: '🟥🟦🟨' },
          story: { title: 'Color Town', text: 'Follow artist Annie through the colorful town.', character: '👩‍🎨' },
          choice: { title: 'Pick the Color', text: 'Choose the color that matches the object.', icon: '🎯' },
          drag: { title: 'Mix & Match', text: 'Drag primary colors to create new ones!', items: ['Red', 'Blue', 'Yellow'] }
        }
      },
      {
        id: 'patterns',
        title: 'Patterns & Repetition',
        completed: userProfile.completedModules.includes('patterns'),
        xp: 50,
        content: {
          doc: { title: 'Pattern Power', text: 'Patterns repeat! ABAB, AABB — let’s find them.', visual: '🔁' },
          story: { title: 'Pattern Parade', text: 'March in a parade of repeating shapes and colors!', character: '🥁' },
          choice: { title: 'What Comes Next?', text: 'Choose the next item in the pattern.', icon: '➡️' },
          drag: { title: 'Make a Pattern', text: 'Drag shapes to create your own pattern.', items: ['🔴', '🟢', '🔵'] }
        }
      },
      {
        id: 'drawing',
        title: 'Drawing Shapes',
        completed: userProfile.completedModules.includes('drawing'),
        xp: 50,
        content: {
          doc: { title: 'Let’s Draw!', text: 'We can draw using shapes like circles and lines.', visual: '✏️' },
          story: { title: 'Doodle Day', text: 'Join Doodle and draw silly shapes!', character: '🖍️' },
          choice: { title: 'Find the Shape', text: 'Which shape do we draw next?', icon: '📐' },
          drag: { title: 'Shape Drawing', text: 'Drag lines to connect and form shapes.', items: ['Line', 'Curve', 'Circle'] }
        }
      }
    ]
  }
  ];

  const badges = {
    first_login: { name: 'First Steps', icon: '🎯', color: 'bg-blue-500' },
    quick_learner: { name: 'Quick Learner', icon: '⚡', color: 'bg-yellow-500' },
    math_master: { name: 'Math Master', icon: '🧮', color: 'bg-green-500' },
    reading_star: { name: 'Reading Star', icon: '⭐', color: 'bg-purple-500' },
    perfect_score: { name: 'Perfect Score', icon: '🏆', color: 'bg-gold-500' }
  };

  const assessmentQuestions = {
    numbers: [
      { question: 'What comes after 3?', options: ['2', '4', '5', '1'], correct: 1, type: 'multiple' },
      { question: 'Drag the number 7 to the box', items: ['5', '7', '9'], correct: '7', type: 'drag' },
      { question: 'Count the stars: ⭐⭐⭐', options: ['2', '3', '4', '5'], correct: 1, type: 'multiple' }
    ],
    shapes: [
      { question: 'Which shape has 3 sides?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], correct: 2, type: 'multiple' },
      { question: 'Match the circle: ○', items: ['○', '□', '△'], correct: '○', type: 'drag' },
      { question: 'How many sides does a square have?', options: ['2', '3', '4', '5'], correct: 2, type: 'multiple' }
    ],
    letters: [
      { question: 'What letter comes after B?', options: ['A', 'C', 'D', 'E'], correct: 1, type: 'multiple' },
      { question: 'Find the letter A', items: ['A', 'B', 'C'], correct: 'A', type: 'drag' },
      { question: 'What sound does "M" make?', options: ['Buh', 'Mmm', 'Sss', 'Tuh'], correct: 1, type: 'multiple' }
    ]
  };

  const renderLevelDetails = (level) => {
  if (!level.unlocked) return null;

  return (
    <div className="mt-2">
      <div className="w-32 h-2 bg-white/20 rounded-full">
        <div
          className="h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${level.completion}%` }}
        ></div>
      </div>
      <p className="text-white/80 text-sm mt-1">
        {level.completion}% Complete
      </p>
    </div>
  );
};

  const gainXP = (points) => {
    playSound('success');
    setUserProfile(prev => ({
      ...prev,
      totalXP: prev.totalXP + points
    }));
    
    // Show celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const completeModule = (moduleId) => {
    setUserProfile(prev => ({
      ...prev,
      completedModules: [...prev.completedModules, moduleId]
    }));
  };

  const CelebrationAnimation = () => (
    <div className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-500 ${showCelebration ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-8xl animate-bounce">🎉</div>
      </div>
      <div className="absolute top-1/4 left-1/4 text-6xl animate-pulse">⭐</div>
      <div className="absolute top-1/3 right-1/4 text-6xl animate-pulse delay-300">🌟</div>
      <div className="absolute bottom-1/3 left-1/3 text-6xl animate-pulse delay-600">✨</div>
    </div>
  );

  const LearningInterface = () => {
    const module = selectedSubject.modules.find(m => m.id === selectedModule);
    const content = module.content[selectedMode.id];
    
    const handleNext = () => {
      if (lessonProgress < 2) {
        setLessonProgress(prev => prev + 1);
        playSound('click');
      } else {
        setShowAssessment(true);
      }
    };

    const handleComplete = () => {
      if (!module.completed) {
        gainXP(module.xp);
        completeModule(module.id);
      }
      setLessonProgress(0);
      setShowAssessment(false);
      setSelectedModule(null);
    };

    if (showAssessment) {
      return <AssessmentInterface onComplete={handleComplete} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setSelectedModule(null)} 
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span>Back to Modules</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-white text-sm">Progress: {lessonProgress + 1}/3</div>
            <div className="w-32 h-2 bg-white/20 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${((lessonProgress + 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4 animate-pulse">
                {selectedMode.id === 'doc' ? content.visual : 
                 selectedMode.id === 'story' ? content.character : 
                 selectedMode.id === 'choice' ? content.icon : 
                 '🎮'}
              </div>
              <h2 className="text-white text-3xl font-bold mb-2">{content.title}</h2>
              <p className="text-white/80 text-lg">{content.text}</p>
            </div>

            {selectedMode.id === 'drag' && (
              <div className="mt-8">
                <h3 className="text-white text-xl font-bold mb-4 text-center">Interactive Activity</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {content.items.map((item, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-4 text-center text-white text-2xl font-bold hover:bg-white/30 transition-colors cursor-pointer">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMode.id === 'choice' && (
              <div className="mt-8">
                <h3 className="text-white text-xl font-bold mb-4 text-center">Make Your Choice</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-bold transition-colors">
                    Option A
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-bold transition-colors">
                    Option B
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <button 
                onClick={handleNext}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center space-x-2 mx-auto"
              >
                <span>{lessonProgress < 2 ? 'Continue' : 'Take Assessment'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AssessmentInterface = ({ onComplete }) => {
    const module = selectedSubject.modules.find(m => m.id === selectedModule);
    const questions = assessmentQuestions[module.id] || [];
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);

    const handleAnswer = (answerIndex) => {
      setSelectedAnswer(answerIndex);
      const isCorrect = answerIndex === questions[currentQuestion].correct;
      
      if (isCorrect) {
        setScore(prev => prev + 1);
        playSound('success');
      } else {
        playSound('error');
      }

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
        } else {
          setShowResult(true);
        }
      }, 1000);
    };

    const handleDragAnswer = (item) => {
      const isCorrect = item === questions[currentQuestion].correct;
      
      if (isCorrect) {
        setScore(prev => prev + 1);
        playSound('success');
      } else {
        playSound('error');
      }

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setDraggedItem(null);
        } else {
          setShowResult(true);
        }
      }, 1000);
    };

    const handleRetry = () => {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setShowResult(false);
      setDraggedItem(null);
    };

    if (showResult) {
      const percentage = (score / questions.length) * 100;
      const passed = percentage >= 70;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-8xl mb-4">
              {passed ? '🎉' : '😊'}
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">
              {passed ? 'Excellent Work!' : 'Good Try!'}
            </h2>
            <p className="text-white/80 text-lg mb-6">
              You scored {score} out of {questions.length} ({percentage.toFixed(0)}%)
            </p>
            
            <div className="flex flex-col space-y-4">
              {passed ? (
                <button 
                  onClick={onComplete}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Continue Learning! 🚀
                </button>
              ) : (
                <button 
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center space-x-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    const question = questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-white text-2xl font-bold">Assessment</h1>
            <div className="text-white">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">{question.question}</h2>
            </div>

            {question.type === 'multiple' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      selectedAnswer === null 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : selectedAnswer === index
                          ? index === question.correct
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : index === question.correct
                            ? 'bg-green-500 text-white'
                            : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'drag' && (
              <div className="space-y-6">
                <div className="flex justify-center space-x-4">
                  {question.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleDragAnswer(item)}
                      className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-lg font-bold text-2xl transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ModuleSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setSelectedMode(null)} 
          className="flex items-center space-x-2 text-white/80 hover:text-white"
        >
          <Home className="w-5 h-5" />
          <span>Back to Modes</span>
        </button>
        <h1 className="text-white text-2xl font-bold">{selectedSubject?.name} - {selectedMode?.name}</h1>
        <div></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedSubject.modules.map((module) => (
            <div 
              key={module.id} 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer group"
              onClick={() => setSelectedModule(module.id)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {module.completed ? '✅' : '📚'}
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{module.title}</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">{module.xp} XP</span>
                </div>
                {module.completed && (
                  <div className="flex items-center justify-center space-x-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="text-4xl animate-bounce">{userProfile.avatar}</div>
          <div>
            <h1 className="text-white text-2xl font-bold">{userProfile.name}</h1>
            <div className="flex items-center space-x-4 text-white/80">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>{userProfile.totalXP} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{userProfile.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
            <Trophy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold mb-4">Choose Your Adventure</h2>
        <div className="space-y-4">
          {levels.map((level) => (
            <div 
              key={level.id} 
              className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r ${level.bgColor} ${level.unlocked ? 'cursor-pointer hover:scale-105' : 'opacity-50 cursor-not-allowed'} transition-all duration-300`}
              onClick={() => {
                if (level.unlocked) {
                  playSound('click');
                  setSelectedLevel(level);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{level.icon}</div>
                  <div>
                    <h3 className="text-white text-xl font-bold">{level.title}</h3>
                    <p className="text-white/80">{level.subtitle}</p>
                    {renderLevelDetails(level)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!level.unlocked && <Lock className="w-6 h-6 text-white/60" />}
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {!level.unlocked && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Unlock with {level.xpRequired} XP</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold mb-4">Your Achievements</h2>
        <div className="flex space-x-3 overflow-x-auto">
          {userProfile.badges.map((badgeId) => {
            const badge = badges[badgeId];
            return (
              <div key={badgeId} className={`${badge.color} p-3 rounded-lg text-white text-center min-w-[80px] hover:scale-105 transition-transform`}>
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium">{badge.name}</p>
              </div>
            );
          })}
          <div className="bg-gray-600/50 p-3 rounded-lg text-white/50 text-center min-w-[80px] border-2 border-dashed border-white/30">
            <div className="text-2xl mb-1">?</div>
            <p className="text-xs font-medium">Next Badge</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">📚</div>
          <div className="text-white font-bold">{userProfile.completedModules.length}</div>
          <div className="text-white/60 text-sm">Modules Done</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-white font-bold">{userProfile.badges.length}</div>
          <div className="text-white/60 text-sm">Badges Earned</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-white font-bold">{userProfile.totalXP}</div>
          <div className="text-white/60 text-sm">Total XP</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-white font-bold">{userProfile.streak}</div>
          <div className="text-white/60 text-sm">Day Streak</div>
        </div>
      </div>

      <CelebrationAnimation />
    </div>
  );

  const SubjectSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setSelectedLevel(null)} 
          className="flex items-center space-x-2 text-white/80 hover:text-white"
        >
          <Home className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-white text-2xl font-bold">{selectedLevel?.title}</h1>
        <div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <div 
            key={subject.id} 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer group"
            onClick={() => {
              playSound('click');
              setSelectedSubject(subject);
            }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${subject.color} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {subject.icon}
              </div>
              <h3 className="text-white text-xl font-bold">{subject.name}</h3>
            </div>
            
            <div className="space-y-3">
              {subject.modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${module.completed ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span className="text-white text-sm">{module.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 text-xs">{module.xp} XP</span>
                    {module.completed && <Award className="w-4 h-4 text-green-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ModeSelection = () => {
    const learningModes = [
      {
        id: 'doc',
        name: 'Doc Mode',
        description: 'Visual guides with explanations',
        icon: BookOpen,
        color: 'bg-blue-500'
      },
      {
        id: 'story',
        name: 'Story Mode',
        description: 'Learn through adventures',
        icon: Play,
        color: 'bg-purple-500'
      },
      {
        id: 'choice',
        name: 'Choice Game',
        description: 'Make decisions to learn',
        icon: Gamepad2,
        color: 'bg-green-500'
      },
      {
        id: 'drag',
        name: 'Drag & Drop',
        description: 'Interactive puzzles',
        icon: Puzzle,
        color: 'bg-orange-500'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setSelectedSubject(null)} 
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span>Back to Subjects</span>
          </button>
          <h1 className="text-white text-2xl font-bold">Choose Learning Mode</h1>
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2 animate-pulse">{selectedSubject?.icon}</div>
            <h2 className="text-white text-xl font-bold">{selectedSubject?.name}</h2>
            <p className="text-white/80">Pick how you want to learn today!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <div 
                  key={mode.id} 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer group"
                  onClick={() => {
                    playSound('click');
                    setSelectedMode(mode);
                  }}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">{mode.name}</h3>
                    <p className="text-white/80">{mode.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  if (selectedModule) {
    return <LearningInterface />;
  }
  
  if (selectedMode) {
    return <ModuleSelection />;
  }
  
  if (selectedSubject) {
    return <ModeSelection />;
  }
  
  if (selectedLevel) {
    return <SubjectSelection />;
  }
  
  return <Dashboard />;
};

export default GamifiedLearningApp;