import React, { useState } from 'react';
import { Plus, Upload, Download, Save, X, BookOpen, Target, GraduationCap, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { CurriculumLevel, Book, Unit, Lesson } from '../types';
import { saveCurriculumToServer, clearAllStoredData } from '../utils/adminStorage';

interface BookManagerProps {
  curriculum: CurriculumLevel[];
  onUpdateCurriculum: (curriculum: CurriculumLevel[]) => void;
}

interface NewBookForm {
  levelId: string;
  name: string;
  description: string;
  isbn: string;
  hyperlink: string;
  bookType: 'student' | 'practice' | 'teacher';
}

const BookManager: React.FC<BookManagerProps> = ({
  curriculum,
  onUpdateCurriculum
}) => {
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [newBook, setNewBook] = useState<NewBookForm>({
    levelId: '',
    name: '',
    description: '',
    isbn: '',
    hyperlink: '',
    bookType: 'student'
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const resetNewBookForm = () => {
    setNewBook({
      levelId: '',
      name: '',
      description: '',
      isbn: '',
      hyperlink: '',
      bookType: 'student'
    });
  };

  const clearAllBooks = async () => {
    if (!confirm('Are you sure you want to remove ALL books from ALL levels? This action cannot be undone and will clear the entire curriculum.')) {
      return;
    }

    if (!confirm('This will permanently delete all curriculum data. Are you absolutely sure?')) {
      return;
    }

    // Clear all stored data first
    try {
      await clearAllStoredData();
    } catch (error) {
      console.error('Failed to clear stored data:', error);
    }

    // Clear all books from all levels
    const clearedCurriculum = curriculum.map(level => ({
      ...level,
      books: []
    }));

    // Update local state
    onUpdateCurriculum(clearedCurriculum);
    
    // Save to server
    try {
      await saveCurriculumToServer(clearedCurriculum);
    } catch (error) {
      console.error('Failed to save to server:', error);
      alert('Books cleared locally but failed to save to server. Please try again.');
    }

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'All books cleared successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  const handleAddBook = async () => {
    if (!newBook.levelId || !newBook.name.trim()) {
      alert('Please select a level and enter a book name');
      return;
    }

    // For teacher books, modify the name to indicate it's a teacher guide
    const bookName = newBook.bookType === 'teacher' 
      ? `${newBook.name.trim()} - Teacher Guide`
      : newBook.name.trim();

    const newBookData: Book = {
      id: `${newBook.levelId}b${Date.now()}`,
      name: bookName,
      description: newBook.description.trim(),
      isbn: newBook.isbn.trim(),
      hyperlink: newBook.hyperlink.trim(),
      isPracticeBook: newBook.bookType === 'practice',
      isTeacherGuide: newBook.bookType === 'teacher',
      units: [{
        id: `unit_${Date.now()}`,
        name: 'Unit 1',
        lessons: [{
          id: `lesson_${Date.now()}`,
          name: 'Lesson 1',
          objective: 'Students will learn the basics of this topic'
        }]
      }]
    };

    const updatedCurriculum = curriculum.map(level => 
      level.id === newBook.levelId
        ? { ...level, books: [...level.books, newBookData] }
        : level
    );

    // Update local state
    onUpdateCurriculum(updatedCurriculum);
    
    // Save to server
    try {
      await saveCurriculumToServer(updatedCurriculum);
    } catch (error) {
      console.error('Failed to save to server:', error);
      alert('Book added locally but failed to save to server. Please try again.');
    }
    
    resetNewBookForm();
    setShowAddBookForm(false);

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMessage.textContent = `Book "${newBookData.name}" added successfully!`;
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  const handleCSVFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      previewCSV(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const previewCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const processCSVUpload = async () => {
    if (!csvFile) return;

    setUploadStatus('processing');
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        
        // Parse CSV more carefully to handle quoted values
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          result.push(current.trim());
          return result;
        };
        
        const lines = text.split('\n').filter(line => line.trim());
        const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
        
        console.log('CSV Headers:', headers);
        
        // Validate required headers
        const requiredHeaders = ['Level', 'Book Name', 'Book Description', 'Book Type'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        // Clear all stored data first
        try {
          await clearAllStoredData();
        } catch (error) {
          console.error('Failed to clear stored data:', error);
        }

        // Group data by level and book
        const bookData: { [key: string]: { [key: string]: any } } = {};
        
        lines.slice(1).forEach(line => {
          const values = parseCSVLine(line).map(v => v.replace(/"/g, '').trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          if (!row['Level'] || !row['Book Name']) return;

          console.log('Processing row:', row);

          // Match level by name (more flexible matching)
          const levelKey = curriculum.find(level => 
            level.name.toLowerCase().includes(row['Level'].toLowerCase()) ||
            row['Level'].toLowerCase().includes(level.name.toLowerCase())
          )?.name || row['Level'];
          
          // Create a unique book key that includes book type to avoid overwriting
          const bookType = row['Book Type']?.toLowerCase() === 'practice' ? 'practice' :
                         row['Book Type']?.toLowerCase() === 'teacher' ? 'teacher' : 'student';
          const bookKey = `${row['Book Name']}_${bookType}`;
          
          if (!bookData[levelKey]) {
            bookData[levelKey] = {};
          }
          
          if (!bookData[levelKey][bookKey]) {
            bookData[levelKey][bookKey] = {
              name: row['Book Name'],
              description: row['Book Description'] || '',
              isbn: row['ISBN'] || '',
              hyperlink: row['Hyperlink'] || '',
              bookType: bookType,
              units: {}
            };
          }

          const unitName = row['Unit Name'] || 'Unit 1';
          if (!bookData[levelKey][bookKey].units[unitName]) {
            bookData[levelKey][bookKey].units[unitName] = [];
          }

          if (row['Lesson Name']) {
            bookData[levelKey][bookKey].units[unitName].push({
              name: row['Lesson Name'],
              objective: row['Lesson Objective'] || `Learn about ${row['Lesson Name']?.toLowerCase()}`
            });
          }
        });

        console.log('Processed book data:', bookData);

        // Start with cleared curriculum levels (keep the level structure but clear books)
        const clearedCurriculum = curriculum.map(level => ({
          ...level,
          books: []
        }));

        // Convert to curriculum format and populate with new data
        const updatedCurriculum = clearedCurriculum.map(level => {
          // Find matching level data with flexible matching
          const levelData = Object.keys(bookData).find(key => 
            key.toLowerCase().includes(level.name.toLowerCase()) ||
            level.name.toLowerCase().includes(key.toLowerCase())
          );
          
          const levelBooks = levelData ? bookData[levelData] : null;
          
          if (!levelBooks) return level;

          const newBooks: Book[] = Object.values(levelBooks).map((bookInfo: any) => {
            const units: Unit[] = Object.entries(bookInfo.units).map(([unitName, lessons]: [string, any]) => ({
              id: `unit_${Date.now()}_${Math.random()}`,
              name: unitName,
              lessons: lessons.map((lesson: any, index: number) => ({
                id: `lesson_${Date.now()}_${index}_${Math.random()}`,
                name: lesson.name,
                objective: lesson.objective
              }))
            }));

            // For teacher books, modify the name to indicate it's a teacher guide
            const bookName = bookInfo.bookType === 'teacher' && !bookInfo.name.toLowerCase().includes('teacher')
              ? `${bookInfo.name} - Teacher Guide`
              : bookInfo.name;

            return {
              id: `${level.id}b${Date.now()}_${Math.random()}`,
              name: bookName,
              description: bookInfo.description,
              isbn: bookInfo.isbn,
              hyperlink: bookInfo.hyperlink,
              isPracticeBook: bookInfo.bookType === 'practice',
              isTeacherGuide: bookInfo.bookType === 'teacher',
              units: units.length > 0 ? units : [{
                id: `unit_${Date.now()}`,
                name: 'Unit 1',
                lessons: [{
                  id: `lesson_${Date.now()}`,
                  name: 'Lesson 1',
                  objective: 'Students will learn the basics of this topic'
                }]
              }]
            };
          });

          console.log(`Level ${level.name}: Created ${newBooks.length} books`);
          newBooks.forEach(book => {
            console.log(`  - ${book.name} (${book.isPracticeBook ? 'practice' : book.isTeacherGuide ? 'teacher' : 'student'})`);
          });
          return {
            ...level,
            books: newBooks
          };
        });

        console.log('Final curriculum structure:', updatedCurriculum);

        // Update local state
        onUpdateCurriculum(updatedCurriculum);
        
        // Save to server
        try {
          await saveCurriculumToServer(updatedCurriculum);
        } catch (error) {
          console.error('Failed to save to server:', error);
          alert('CSV imported locally but failed to save to server. Please try again.');
        }
        
        setUploadStatus('success');
        setCsvFile(null);
        setCsvPreview([]);
        setShowCSVUpload(false);

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        const totalBooks = updatedCurriculum.reduce((sum, level) => sum + level.books.length, 0);
        successMessage.textContent = `CSV data imported successfully! ${totalBooks} books imported across ${Object.keys(bookData).length} levels.`;
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 5000);

      } catch (error) {
        console.error('CSV processing error:', error);
        setUploadStatus('error');
        alert(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    reader.readAsText(csvFile);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['Level', 'Book Name', 'Book Description', 'Book Type', 'ISBN', 'Hyperlink', 'Unit Name', 'Lesson Name', 'Lesson Objective'],
      ['Level 1 (Ages 3-4)', 'Sample Student Book', 'A comprehensive learning book for young children', 'student', '978-1-234567-99-9', 'https://example.com/book', 'Introduction to Learning', 'First Steps', 'Students will understand basic concepts and develop foundational skills'],
      ['Level 1 (Ages 3-4)', 'Sample Student Book', 'A comprehensive learning book for young children', 'student', '978-1-234567-99-9', 'https://example.com/book', 'Introduction to Learning', 'Building Confidence', 'Students will gain confidence in their learning abilities'],
      ['Level 1 (Ages 3-4)', 'Sample Student Book', 'A comprehensive learning book for young children', 'student', '978-1-234567-99-9', 'https://example.com/book', 'Advanced Concepts', 'Exploring Ideas', 'Students will explore new ideas and concepts'],
      ['Level 1 (Ages 3-4)', 'Sample Practice Book', 'Practice exercises for skill reinforcement', 'practice', '978-1-234567-98-8', '', 'Practice Exercises', 'Exercise 1', 'Students will practice fundamental skills through guided exercises'],
      ['Level 1 (Ages 3-4)', 'Sample Teacher Guide', 'Comprehensive teaching guide with lesson plans', 'teacher', '978-1-234567-97-7', '', 'Teaching Strategies', 'Classroom Management', 'Teachers will learn effective classroom management techniques'],
      ['Level 2 (Ages 4-5)', 'Another Book', 'Description for another book', 'student', '', '', 'Unit A', 'Lesson Alpha', 'Students will learn advanced concepts for their age group']
    ];

    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kodeit-curriculum-sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const removeBook = async (levelId: string, bookId: string) => {
    if (!confirm('Are you sure you want to remove this book? This action cannot be undone.')) {
      return;
    }

    const updatedCurriculum = curriculum.map(level => 
      level.id === levelId
        ? { ...level, books: level.books.filter(book => book.id !== bookId) }
        : level
    );

    // Update local state
    onUpdateCurriculum(updatedCurriculum);
    
    // Save to server
    try {
      await saveCurriculumToServer(updatedCurriculum);
    } catch (error) {
      console.error('Failed to save to server:', error);
      alert('Book removed locally but failed to save to server. Please try again.');
    }

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Book removed successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Book Management</h3>
        <div className="flex space-x-2">
          <button
            onClick={clearAllBooks}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
          <button
            onClick={() => setShowCSVUpload(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <Upload className="w-4 h-4" />
            <span>CSV Upload</span>
          </button>
          <button
            onClick={() => setShowAddBookForm(true)}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Current Books Overview */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Current Books by Level</h4>
        <div className="space-y-2">
          {curriculum.map(level => (
            <div key={level.id} className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <span className="font-medium text-gray-900">{level.name}</span>
                <span className="text-sm text-gray-600 ml-2">
                  ({level.books.length} books: {level.books.filter(b => !b.isPracticeBook && !b.isTeacherGuide).length} student, {level.books.filter(b => b.isPracticeBook).length} practice, {level.books.filter(b => b.isTeacherGuide).length} teacher)
                </span>
              </div>
              <div className="flex space-x-1">
                {level.books.map(book => (
                  <div key={book.id} className="group relative">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${
                      book.isPracticeBook ? 'bg-orange-100 text-orange-700' : 
                      book.isTeacherGuide ? 'bg-teal-100 text-teal-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {book.isPracticeBook ? 'P' : book.isTeacherGuide ? 'T' : 'S'}
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {book.name}
                      <button
                        onClick={() => removeBook(level.id, book.id)}
                        className="ml-2 text-red-300 hover:text-red-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Book Form */}
      {showAddBookForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Add New Book</h4>
              <button
                onClick={() => {
                  setShowAddBookForm(false);
                  resetNewBookForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={newBook.levelId}
                  onChange={(e) => setNewBook(prev => ({ ...prev, levelId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a level</option>
                  {curriculum.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="student"
                      checked={newBook.bookType === 'student'}
                      onChange={(e) => setNewBook(prev => ({ ...prev, bookType: e.target.value as 'student' | 'practice' | 'teacher' }))}
                      className="mr-2"
                    />
                    <BookOpen className="w-4 h-4 mr-1 text-blue-600" />
                    Student Book
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="practice"
                      checked={newBook.bookType === 'practice'}
                      onChange={(e) => setNewBook(prev => ({ ...prev, bookType: e.target.value as 'student' | 'practice' | 'teacher' }))}
                      className="mr-2"
                    />
                    <Target className="w-4 h-4 mr-1 text-orange-600" />
                    Practice Book
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="teacher"
                      checked={newBook.bookType === 'teacher'}
                      onChange={(e) => setNewBook(prev => ({ ...prev, bookType: e.target.value as 'student' | 'practice' | 'teacher' }))}
                      className="mr-2"
                    />
                    <GraduationCap className="w-4 h-4 mr-1 text-teal-600" />
                    Teacher Guide
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Name *</label>
                <input
                  type="text"
                  value={newBook.name}
                  onChange={(e) => setNewBook(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter book name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Enter book description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook(prev => ({ ...prev, isbn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="978-1-234567-89-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hyperlink</label>
                <input
                  type="url"
                  value={newBook.hyperlink}
                  onChange={(e) => setNewBook(prev => ({ ...prev, hyperlink: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/book"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddBookForm(false);
                  resetNewBookForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBook}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Add Book</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">CSV Upload - Replace All Books</h4>
              <button
                onClick={() => {
                  setShowCSVUpload(false);
                  setCsvFile(null);
                  setCsvPreview([]);
                  setUploadStatus('idle');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Warning Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-medium text-red-900 mb-2">⚠️ IMPORTANT: This will replace ALL existing books and clear all stored data</h5>
                    <p className="text-red-800 text-sm">
                      Uploading a CSV file will completely clear all existing books from all levels, clear all stored data (including localStorage and server data), and replace everything with the data from your CSV file. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample CSV Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h5>
                    <p className="text-blue-800 text-sm mb-3">
                      Your CSV file must include these columns: Level, Book Name, Book Description, Book Type (student/practice/teacher), ISBN, Hyperlink, Unit Name, Lesson Name, Lesson Objective
                    </p>
                    <button
                      onClick={downloadSampleCSV}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sample CSV</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CSV Preview */}
              {csvPreview.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Preview (First 5 rows)</h5>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(csvPreview[0]).map(header => (
                            <th key={header} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.map((row, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 text-gray-600">
                                {String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Upload Status */}
              {uploadStatus !== 'idle' && (
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  uploadStatus === 'processing' ? 'bg-yellow-50 text-yellow-800' :
                  uploadStatus === 'success' ? 'bg-green-50 text-green-800' :
                  'bg-red-50 text-red-800'
                }`}>
                  {uploadStatus === 'processing' && (
                    <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {uploadStatus === 'success' && <Save className="w-4 h-4" />}
                  {uploadStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                  <span>
                    {uploadStatus === 'processing' && 'Processing CSV file and replacing all books...'}
                    {uploadStatus === 'success' && 'CSV data imported successfully! All books have been replaced.'}
                    {uploadStatus === 'error' && 'Error processing CSV file'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCSVUpload(false);
                  setCsvFile(null);
                  setCsvPreview([]);
                  setUploadStatus('idle');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={processCSVUpload}
                disabled={!csvFile || uploadStatus === 'processing'}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <Upload className="w-4 h-4" />
                <span>⚠️ Replace All Data with CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Instructions</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use "Clear All" to remove all books from all levels (cannot be undone)</li>
          <li>• Use "CSV Upload" to replace ALL existing data (books, localStorage, server data) with new data from your CSV file</li>
          <li>• Use "Add Book" to manually add individual books to any level</li>
          <li>• Download the sample CSV to see the exact format required</li>
          <li>• Book types: Student (S), Practice (P), Teacher Guide (T)</li>
          <li>• Teacher guides are standalone books with their own content</li>
          <li>• CSV upload will completely clear and replace all existing curriculum data</li>
          <li>• Hover over book icons to see names and remove individual books</li>
          <li>• All changes are automatically saved to the server</li>
        </ul>
      </div>
    </div>
  );
};

export default BookManager;