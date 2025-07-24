import React, { useState } from 'react';
import { Plus, Minus, Save, RotateCcw, ChevronDown, ChevronUp, Edit3, Target } from 'lucide-react';
import { CurriculumLevel, Book, Unit, Lesson } from '../types';

interface CurriculumEditorProps {
  curriculum: CurriculumLevel[];
  onUpdateCurriculum: (curriculum: CurriculumLevel[]) => void;
}

const CurriculumEditor: React.FC<CurriculumEditorProps> = ({
  curriculum,
  onUpdateCurriculum
}) => {
  const [selectedBook, setSelectedBook] = useState<{ levelId: string; bookId: string } | null>(null);
  const [localBook, setLocalBook] = useState<Book | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);

  const handleBookSelect = (levelId: string, bookId: string) => {
    const level = curriculum.find(l => l.id === levelId);
    const book = level?.books.find(b => b.id === bookId);
    
    if (book) {
      setSelectedBook({ levelId, bookId });
      setLocalBook({ 
        ...book, 
        units: book.units.map(u => ({ 
          ...u, 
          lessons: u.lessons.map(l => ({ ...l }))
        }))
      });
      setExpandedUnits(book.units.map(u => u.id));
    }
  };

  const updateBookName = (name: string) => {
    if (localBook) {
      setLocalBook({ ...localBook, name });
    }
  };

  const updateBookDescription = (description: string) => {
    if (localBook) {
      setLocalBook({ ...localBook, description });
    }
  };

  const addUnit = () => {
    if (!localBook) return;
    
    const newUnit: Unit = {
      id: `unit_${Date.now()}`,
      name: '',
      lessons: [{
        id: `lesson_${Date.now()}`,
        name: '',
        objective: ''
      }]
    };
    setLocalBook({
      ...localBook,
      units: [...localBook.units, newUnit]
    });
    setExpandedUnits(prev => [...prev, newUnit.id]);
  };

  const removeUnit = (unitId: string) => {
    if (!localBook) return;
    
    setLocalBook({
      ...localBook,
      units: localBook.units.filter(u => u.id !== unitId)
    });
    setExpandedUnits(prev => prev.filter(id => id !== unitId));
  };

  const updateUnitName = (unitId: string, name: string) => {
    if (!localBook) return;
    
    setLocalBook({
      ...localBook,
      units: localBook.units.map(unit => 
        unit.id === unitId ? { ...unit, name } : unit
      )
    });
  };

  const addLesson = (unitId: string) => {
    if (!localBook) return;
    
    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      name: '',
      objective: ''
    };
    
    setLocalBook({
      ...localBook,
      units: localBook.units.map(unit => 
        unit.id === unitId 
          ? { ...unit, lessons: [...unit.lessons, newLesson] }
          : unit
      )
    });
  };

  const removeLesson = (unitId: string, lessonIndex: number) => {
    if (!localBook) return;
    
    setLocalBook({
      ...localBook,
      units: localBook.units.map(unit => 
        unit.id === unitId 
          ? { ...unit, lessons: unit.lessons.filter((_, i) => i !== lessonIndex) }
          : unit
      )
    });
  };

  const updateLesson = (unitId: string, lessonIndex: number, lesson: string) => {
    if (!localBook) return;
    
    setLocalBook({
      ...localBook,
      units: localBook.units.map(unit => 
        unit.id === unitId 
          ? { 
              ...unit, 
              lessons: unit.lessons.map((l, i) => 
                i === lessonIndex ? { ...l, name: lesson } : l
              )
            }
          : unit
      )
    });
  };

  const updateLessonObjective = (unitId: string, lessonIndex: number, objective: string) => {
    if (!localBook) return;
    
    setLocalBook({
      ...localBook,
      units: localBook.units.map(unit => 
        unit.id === unitId 
          ? { 
              ...unit, 
              lessons: unit.lessons.map((l, i) => 
                i === lessonIndex ? { ...l, objective } : l
              )
            }
          : unit
      )
    });
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const saveChanges = () => {
    if (!selectedBook || !localBook) return;
    
    const updatedCurriculum = curriculum.map(level => 
      level.id === selectedBook.levelId
        ? {
            ...level,
            books: level.books.map(book => 
              book.id === selectedBook.bookId
                ? localBook
                : book
            )
          }
        : level
    );
    
    onUpdateCurriculum(updatedCurriculum);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Changes saved successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  const resetChanges = () => {
    if (selectedBook) {
      handleBookSelect(selectedBook.levelId, selectedBook.bookId);
    }
  };

  const hasChanges = () => {
    if (!selectedBook || !localBook) return false;
    
    const originalBook = curriculum
      .find(l => l.id === selectedBook.levelId)
      ?.books.find(b => b.id === selectedBook.bookId);
    
    if (!originalBook) return false;
    
    return JSON.stringify(localBook) !== JSON.stringify(originalBook);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Curriculum Editor</h3>
        {hasChanges() && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-1">
            <span className="text-yellow-800 text-sm font-medium">Unsaved changes</span>
          </div>
        )}
      </div>

      {/* Book Selection */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Select Book to Edit</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {curriculum.map(level => 
            level.books.map(book => (
              <button
                key={`${level.id}-${book.id}`}
                onClick={() => handleBookSelect(level.id, book.id)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  selectedBook?.levelId === level.id && selectedBook?.bookId === book.id
                    ? 'bg-blue-100 border-blue-300 text-blue-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{book.name}</div>
                <div className="text-xs text-gray-600">{level.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {book.units.length} units • {book.units.reduce((total, unit) => total + unit.lessons.length, 0)} lessons
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedBook && localBook && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">
                Editing Book
              </h4>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={resetChanges}
                disabled={!hasChanges()}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={saveChanges}
                disabled={!hasChanges()}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Book Details */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-3">Book Information</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Book Name</label>
                  <input
                    type="text"
                    value={localBook.name}
                    onChange={(e) => updateBookName(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    placeholder="Enter book name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Description</label>
                  <textarea
                    value={localBook.description}
                    onChange={(e) => updateBookDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                    placeholder="Enter book description"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <span className="font-medium text-blue-700">Units:</span> {localBook.units.length}
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-medium text-blue-700">Total Lessons:</span> {localBook.units.reduce((total, unit) => total + unit.lessons.length, 0)}
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-medium text-blue-700">Type:</span> {localBook.isPracticeBook ? 'Practice' : 'Regular'}
                  </div>
                </div>
              </div>
            </div>

            {/* Units & Lessons */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-900">Units & Lessons ({localBook.units.length} units)</h5>
                <button
                  onClick={addUnit}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Unit</span>
                </button>
              </div>

              {/* Units List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {localBook.units.map((unit, unitIndex) => (
                  <div key={unit.id} className="bg-white border border-gray-200 rounded-lg">
                    {/* Unit Header */}
                    <div className="bg-blue-50 p-3 border-b border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold min-w-[2rem] text-center">
                            {unitIndex + 1}
                          </span>
                          <input
                            type="text"
                            value={unit.name}
                            onChange={(e) => updateUnitName(unit.id, e.target.value)}
                            className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                            placeholder="Unit name"
                          />
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {unit.lessons.length} lessons
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleUnit(unit.id)}
                            className="p-1 hover:bg-blue-100 rounded transition-colors"
                          >
                            {expandedUnits.includes(unit.id) ? (
                              <ChevronUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                          <button
                            onClick={() => removeUnit(unit.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unit Lessons */}
                    {expandedUnits.includes(unit.id) && (
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="text-sm font-medium text-gray-700">Lessons</h6>
                          <button
                            onClick={() => addLesson(unit.id)}
                            className="px-2 py-1 bg-teal-600 text-white rounded text-xs hover:bg-teal-700 transition-colors flex items-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Lesson</span>
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {unit.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
                              <div className="flex items-center space-x-2">
                              <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium min-w-[2rem] text-center">
                                {lessonIndex + 1}
                              </span>
                              <input
                                type="text"
                                value={lesson.name}
                                onChange={(e) => updateLesson(unit.id, lessonIndex, e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                                placeholder="Lesson name"
                              />
                              <button
                                onClick={() => removeLesson(unit.id, lessonIndex)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Target className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                                <textarea
                                  value={lesson.objective}
                                  onChange={(e) => updateLessonObjective(unit.id, lessonIndex, e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm resize-none"
                                  rows={2}
                                  placeholder="Learning objective for this lesson..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {unit.lessons.length === 0 && (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No lessons added yet. Click "Add Lesson" to start.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {localBook.units.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No units defined.</p>
                  <p className="text-sm">Click "Add Unit" to start adding content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Instructions</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select a book from the list above to edit its details, units, and lessons</li>
          <li>• Edit the book name and description in the "Book Information" section</li>
          <li>• Use "Add Unit" to create new units, "Add Lesson" to add lessons to units</li>
          <li>• Click the chevron icon to expand/collapse unit details</li>
          <li>• Each unit can have multiple lessons organized under it</li>
          <li>• Use the "-" button to remove units or lessons</li>
          <li>• The "Save" button will be enabled when you make changes</li>
          <li>• Remember to click "Save" to apply your changes permanently</li>
        </ul>
      </div>
    </div>
  );
};

export default CurriculumEditor;