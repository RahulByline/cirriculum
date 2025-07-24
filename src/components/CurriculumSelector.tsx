import React from 'react';
import { ChevronDown, ChevronUp, BookOpen, GraduationCap } from 'lucide-react';
import { CurriculumLevel, Book } from '../types';

interface CurriculumSelectorProps {
  levels: CurriculumLevel[];
  selectedLevels: string[];
  selectedBooks: string[];
  selectedGuides: string[];
  onLevelToggle: (levelId: string) => void;
  onBookToggle: (bookId: string, levelId: string) => void;
  onGuideToggle: (bookId: string, levelId: string) => void;
}

const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({
  levels,
  selectedLevels,
  selectedBooks,
  selectedGuides,
  onLevelToggle,
  onBookToggle,
  onGuideToggle,
}) => {
  const [expandedLevels, setExpandedLevels] = React.useState<string[]>([]);

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => 
      prev.includes(levelId) 
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    );
  };

  const isLevelExpanded = (levelId: string) => expandedLevels.includes(levelId);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Books</h3>
      
      {levels.map(level => (
        <div key={level.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`level-${level.id}`}
                  checked={selectedLevels.includes(level.id)}
                  onChange={() => onLevelToggle(level.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`level-${level.id}`}
                  className="text-lg font-medium text-gray-900 cursor-pointer"
                >
                  {level.name}
                </label>
                <span className="text-sm text-gray-500">
                  ({level.books.length} books)
                </span>
              </div>
              <button
                onClick={() => toggleLevel(level.id)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                {isLevelExpanded(level.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          {isLevelExpanded(level.id) && (
            <div className="p-4 bg-white space-y-3">
              {level.books.map(book => (
                <div key={book.id} className="flex items-start space-x-4 p-3 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{book.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{book.description}</p>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Units:</span> {book.units.map(u => u.name).join(' • ')}
                      </div>
                      <div className="text-xs text-gray-500 max-h-16 overflow-y-auto">
                        <span className="font-medium">Total Lessons:</span> {book.units.reduce((total, unit) => total + unit.lessons.length, 0)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {book.isTeacherGuide ? (
                      // This is a teacher guide book - show teacher guide checkbox
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedGuides.includes(book.id)}
                          onChange={() => onGuideToggle(book.id, level.id)}
                          className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                        />
                        <GraduationCap className="w-4 h-4 text-teal-600" />
                        <span>Teacher Guide</span>
                      </label>
                    ) : (
                      // This is a student or practice book - show student/practice checkbox
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={() => onBookToggle(book.id, level.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>{book.isPracticeBook ? 'Practice Book' : 'Student Book'}</span>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CurriculumSelector;