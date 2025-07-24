import React from 'react';
import { X, BookOpen, GraduationCap, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { CurriculumLevel } from '../types';

interface CurriculumViewerProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: CurriculumLevel[];
}

const CurriculumViewer: React.FC<CurriculumViewerProps> = ({
  isOpen,
  onClose,
  curriculum
}) => {
  const [expandedLevels, setExpandedLevels] = React.useState<string[]>([]);
  const [expandedBooks, setExpandedBooks] = React.useState<string[]>([]);
  const [expandedUnits, setExpandedUnits] = React.useState<string[]>([]);

  if (!isOpen) return null;

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => 
      prev.includes(levelId) 
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    );
  };

  const toggleBook = (bookId: string) => {
    setExpandedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const isLevelExpanded = (levelId: string) => expandedLevels.includes(levelId);
  const isBookExpanded = (bookId: string) => expandedBooks.includes(bookId);
  const isUnitExpanded = (unitId: string) => expandedUnits.includes(unitId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-teal-600">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">KODEIT Pre-K Curriculum Overview</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {curriculum.map((level, levelIndex) => (
              <div key={level.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 overflow-hidden">
                {/* Level Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => toggleLevel(level.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {levelIndex + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{level.name}</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {level.books.length} books
                      </span>
                    </div>
                    {isLevelExpanded(level.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Level Content */}
                {isLevelExpanded(level.id) && (
                  <div className="px-4 pb-4 space-y-4">
                    {level.books.map((book, bookIndex) => (
                      <div key={book.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        {/* Book Header */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => toggleBook(book.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                book.isPracticeBook ? 'bg-orange-500' : 'bg-teal-600'
                              }`}>
                                {bookIndex + 1}
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{book.name}</h4>
                                <p className="text-sm text-gray-600">{book.description}</p>
                              </div>
                              {book.isPracticeBook && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Practice Book
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {book.units.length} units • {book.units.reduce((total, unit) => total + unit.lessons.length, 0)} lessons
                                </div>
                              </div>
                              {isBookExpanded(book.id) ? (
                                <ChevronUp className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Book Content */}
                        {isBookExpanded(book.id) && (
                          <div className="p-4 bg-gray-50">
                            <div className="space-y-4">
                              <h5 className="text-md font-semibold text-gray-900 flex items-center">
                                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                Units & Lessons ({book.units.length} units, {book.units.reduce((total, unit) => total + unit.lessons.length, 0)} lessons)
                              </h5>
                              
                              {book.units.map((unit, unitIndex) => (
                                <div key={unit.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  {/* Unit Header - Collapsible */}
                                  <div 
                                    className="bg-blue-50 p-3 border-b border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                                    onClick={() => toggleUnit(unit.id)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold min-w-[2rem] text-center">
                                          {unitIndex + 1}
                                        </span>
                                        <h6 className="text-sm font-semibold text-blue-900">{unit.name}</h6>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                          {unit.lessons.length} lessons
                                        </span>
                                      </div>
                                      {isUnitExpanded(unit.id) ? (
                                        <ChevronUp className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-blue-600" />
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Unit Lessons - Collapsible Content */}
                                  {isUnitExpanded(unit.id) && (
                                    <div className="p-4">
                                      <div className="space-y-3">
                                        {unit.lessons.map((lesson, lessonIndex) => (
                                          <div key={lesson.id || lessonIndex} className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                              {/* Lesson Name Column */}
                                              <div className="p-3 bg-teal-50 border-r border-gray-200">
                                                <div className="flex items-center space-x-3">
                                                  <span className="bg-teal-500 text-white px-2 py-1 rounded text-xs font-bold min-w-[2rem] text-center">
                                                    {lessonIndex + 1}
                                                  </span>
                                                  <h7 className="text-sm font-medium text-teal-900 leading-relaxed">
                                                    {typeof lesson === 'string' ? lesson : lesson.name}
                                                  </h7>
                                                </div>
                                              </div>
                                              
                                              {/* Learning Objective Column */}
                                              <div className="p-3 bg-orange-50">
                                                <div className="flex items-start space-x-2">
                                                  <Target className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                                  <div className="flex-1">
                                                    <span className="text-xs font-medium text-orange-800 block mb-1">Learning Objective:</span>
                                                    <p className="text-xs text-orange-700 leading-relaxed">
                                                      {typeof lesson === 'object' && lesson.objective 
                                                        ? lesson.objective 
                                                        : `Learn about ${typeof lesson === 'string' ? lesson.toLowerCase() : (lesson.name || 'this topic').toLowerCase()}`
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {unit.lessons.length === 0 && (
                                        <div className="text-center py-4 text-gray-500 text-sm">
                                          No lessons defined for this unit.
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {book.units.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <p className="text-sm">No units defined for this book.</p>
                                </div>
                              )}
                            </div>

                            {/* Teacher Guide Note */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <GraduationCap className={`w-4 h-4 ${book.isPracticeBook ? 'text-gray-400' : 'text-teal-600'}`} />
                                <span className={`text-sm ${book.isPracticeBook ? 'text-gray-500' : 'text-teal-700'}`}>
                                  {book.isPracticeBook 
                                    ? 'Teacher Guide: Not available for practice books'
                                    : 'Teacher Guide: Available with detailed lesson plans and activities'
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Complete curriculum overview for KODEIT Pre-K program
              </p>
              <div className="flex justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Regular Books</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Practice Books</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 text-teal-600" />
                  <span>Teacher Guides Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-orange-600" />
                  <span>Learning Objectives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumViewer;