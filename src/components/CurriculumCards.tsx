import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Target, ExternalLink, Users, User, Check, Award, Globe, Star, Shield } from 'lucide-react';
import { CurriculumLevel, CurriculumStructureConfig } from '../types';

interface CurriculumCardsProps {
  curriculum: CurriculumLevel[];
  curriculumStructure: CurriculumStructureConfig;
  selectedBooks?: string[];
  selectedGuides?: string[];
  onBookToggle?: (bookId: string, levelId: string) => void;
  onGuideToggle?: (bookId: string, levelId: string) => void;
  onISBNUpdate?: (bookId: string, isbn: string) => void;
}

const CurriculumCards: React.FC<CurriculumCardsProps> = ({ 
  curriculum,
  curriculumStructure,
  selectedBooks = [],
  selectedGuides = [],
  onBookToggle,
  onGuideToggle,
}) => {

  const handleBookClick = (hyperlink?: string) => {
    if (hyperlink) {
      window.open(hyperlink, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate totals for overview
  const calculateTotals = () => {
    let totalStudentBooks = 0;
    let totalPracticeBooks = 0;
    let totalTeacherGuides = 0;
    let totalUnits = 0;
    let totalLessons = 0;
    let selectedStudentBooks = 0;
    let selectedPracticeBooks = 0;
    let selectedTeacherGuides = 0;

    curriculum.forEach(level => {
      level.books.forEach(book => {
        totalUnits += book.units.length;
        totalLessons += book.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
        
        if (book.isTeacherGuide) {
          totalTeacherGuides++;
          if (selectedGuides.includes(book.id)) {
            selectedTeacherGuides++;
          }
        } else if (book.isPracticeBook) {
          totalPracticeBooks++;
          if (selectedBooks.includes(book.id)) {
            selectedPracticeBooks++;
          }
        } else {
          totalStudentBooks++;
          if (selectedBooks.includes(book.id)) {
            selectedStudentBooks++;
          }
        }
      });
    });

    return {
      totalStudentBooks,
      totalPracticeBooks,
      totalTeacherGuides,
      totalUnits,
      totalLessons,
      selectedStudentBooks,
      selectedPracticeBooks,
      selectedTeacherGuides
    };
  };

  // Organize books by type
  const organizeBooks = () => {
    const studentBooks: any[] = [];
    const practiceBooks: any[] = [];
    const teacherGuides: any[] = [];

    curriculum.forEach(level => {
      level.books.forEach(book => {
        const bookWithLevel = { ...book, levelName: level.name, levelId: level.id };
        
        if (book.isTeacherGuide) {
          teacherGuides.push(bookWithLevel);
        } else if (book.isPracticeBook) {
          practiceBooks.push(bookWithLevel);
        } else {
          studentBooks.push(bookWithLevel);
        }
      });
    });

    return { studentBooks, practiceBooks, teacherGuides };
  };

  const { studentBooks, practiceBooks, teacherGuides } = organizeBooks();
  const totals = calculateTotals();

  // Helper function to get icon component from string
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      BookOpen,
      GraduationCap,
      Target,
      Users
    };
    return icons[iconName] || BookOpen;
  };

  const BookCard = ({ book, type }: { book: any; type: 'student' | 'practice' | 'teacher' }) => {
    // Skip rendering if this is a teacher guide book but we're trying to render it as student/practice
    if (book.isTeacherGuide && type !== 'teacher') {
      return null;
    }
    
    // Skip rendering if this is not a teacher guide but we're trying to render it as teacher
    if (!book.isTeacherGuide && type === 'teacher') {
      return null;
    }
    
    const getCardColor = () => {
      switch (type) {
        case 'student': return 'border-blue-200 bg-blue-50';
        case 'practice': return 'border-orange-200 bg-orange-50';
        case 'teacher': return 'border-teal-200 bg-teal-50';
        default: return 'border-gray-200 bg-gray-50';
      }
    };

    const getIconColor = () => {
      switch (type) {
        case 'student': return 'text-blue-600';
        case 'practice': return 'text-orange-600';
        case 'teacher': return 'text-teal-600';
        default: return 'text-gray-600';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'student': return BookOpen;
        case 'practice': return Target;
        case 'teacher': return GraduationCap;
        default: return BookOpen;
      }
    };

    const Icon = getIcon();
    const hasHyperlink = book.hyperlink && book.hyperlink.trim() !== '';
    
    // Determine if this book is selected
    const bookId = book.id;
    const isSelected = type === 'teacher' 
      ? selectedGuides.includes(bookId)
      : selectedBooks.includes(bookId);

    const handleSelectionToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (type === 'teacher') {
        onGuideToggle?.(bookId, book.levelId);
      } else {
        onBookToggle?.(bookId, book.levelId);
      }
    };

    return (
      <div 
        className={`border-2 rounded-lg p-4 transition-all duration-200 relative ${getCardColor()} ${
          hasHyperlink ? 'hover:shadow-lg cursor-pointer transform hover:-translate-y-1' : ''
        } ${isSelected ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
        onClick={() => hasHyperlink && handleBookClick(book.hyperlink)}
      >
        {/* Selection Controls */}
        {(onBookToggle || onGuideToggle) && (
          <div className="absolute top-2 right-2">
            {/* Selection Checkbox */}
            <button
              onClick={handleSelectionToggle}
              className={`p-1 rounded-full transition-colors ${
                isSelected 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isSelected ? 'Remove from selection' : 'Add to selection'}
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-start justify-between mb-3 pr-16">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${getIconColor()}`} />
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              type === 'student' ? 'bg-blue-100 text-blue-800' :
              type === 'practice' ? 'bg-orange-100 text-orange-800' :
              'bg-teal-100 text-teal-800'
            }`}>
              {type === 'student' ? 'Student Book' :
               type === 'practice' ? 'Practice Book' :
               'Teacher Guide'}
            </span>
          </div>
          {hasHyperlink && (
            <ExternalLink className={`w-4 h-4 ${getIconColor()}`} />
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{book.name}</h3>
        {book.isbn && (
          <p className="text-xs text-gray-500 mb-2 font-mono">ISBN: {book.isbn}</p>
        )}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{book.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">{book.levelName}</span>
            <span>{book.units?.length || 0} units</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total Lessons:</span>
            <span>{book.units?.reduce((total: number, unit: any) => total + (unit.lessons?.length || 0), 0) || 0}</span>
          </div>
          
          {type === 'teacher' && (
            <div className="flex items-center space-x-1 text-xs text-teal-600">
              <User className="w-3 h-3" />
              <span>For Teachers</span>
            </div>
          )}
          
          {type === 'student' && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Users className="w-3 h-3" />
              <span>For Students</span>
            </div>
          )}
          
          {/* Selection Status */}
          {isSelected && (
            <div className="flex items-center space-x-1 text-xs text-green-600 font-medium">
              <Check className="w-3 h-3" />
              <span>Selected</span>
            </div>
          )}
          
          {hasHyperlink && (
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">Click to view book</span>
              <div className="flex items-center space-x-1 text-xs font-medium text-blue-600">
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          )}
          
          {!hasHyperlink && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-400 italic">No link available</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, count, selectedCount, icon: Icon, color }: { 
    title: string; 
    count: number;
    selectedCount: number;
    icon: any; 
    color: string; 
  }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{count} books available</p>
        </div>
      </div>
      {(onBookToggle || onGuideToggle) && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="text-sm font-medium text-green-800">
            {selectedCount} of {count} selected
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          KODEIT Pre-K Curriculum
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive educational materials designed to support early childhood development 
          through engaging, age-appropriate content across multiple learning domains.
        </p>
        {(onBookToggle || onGuideToggle) && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <Check className="w-4 h-4 inline mr-1" /> 
              Select books below to add them to your cost calculation.
            </p>
          </div>
        )}
      </div>

      {/* Curriculum Overview - Moved to top */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Curriculum Overview</h2>
          <p className="text-blue-100">Complete educational solution for Pre-K learning</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{curriculum.length}</div>
            <div className="text-blue-100 text-sm">Learning Levels</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {totals.selectedStudentBooks > 0 ? `${totals.selectedStudentBooks}/` : ''}{totals.totalStudentBooks}
            </div>
            <div className="text-blue-100 text-sm">Student Books</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {totals.selectedPracticeBooks > 0 ? `${totals.selectedPracticeBooks}/` : ''}{totals.totalPracticeBooks}
            </div>
            <div className="text-blue-100 text-sm">Practice Books</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {totals.selectedTeacherGuides > 0 ? `${totals.selectedTeacherGuides}/` : ''}{totals.totalTeacherGuides}
            </div>
            <div className="text-blue-100 text-sm">Teacher Guides</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{totals.totalLessons}</div>
            <div className="text-blue-100 text-sm">Total Lessons</div>
          </div>
        </div>
      </div>

      {/* Educational Standards Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-yellow-300 mr-3" />
            <h2 className="text-3xl font-bold">Educational Standards Alignment</h2>
          </div>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto">
            Our curriculum is meticulously mapped to internationally recognized educational standards, 
            ensuring comprehensive coverage and seamless integration with global educational frameworks.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* CCSS */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">CCSS</h3>
            <p className="text-sm text-indigo-100 mb-3">Common Core State Standards</p>
            <div className="text-xs text-indigo-200 leading-relaxed">
              Comprehensive alignment with mathematics and English language arts standards for early learners
            </div>
          </div>

          {/* NGSS */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">NGSS</h3>
            <p className="text-sm text-indigo-100 mb-3">Next Generation Science Standards</p>
            <div className="text-xs text-indigo-200 leading-relaxed">
              Science and engineering practices integrated throughout the curriculum for inquiry-based learning
            </div>
          </div>

          {/* EYLF */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">EYLF</h3>
            <p className="text-sm text-indigo-100 mb-3">Early Years Learning Framework</p>
            <div className="text-xs text-indigo-200 leading-relaxed">
              Australian framework focusing on play-based learning and holistic child development
            </div>
          </div>

          {/* EYFS */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">EYFS</h3>
            <p className="text-sm text-indigo-100 mb-3">Early Years Foundation Stage</p>
            <div className="text-xs text-indigo-200 leading-relaxed">
              UK statutory framework ensuring quality and consistency in early years education
            </div>
          </div>

          {/* IB PYP */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">IB PYP</h3>
            <p className="text-sm text-indigo-100 mb-3">International Baccalaureate Primary Years Programme</p>
            <div className="text-xs text-indigo-200 leading-relaxed">
              Inquiry-driven, transdisciplinary curriculum framework for international-minded learners
            </div>
          </div>
        </div>

        {/* Standards Benefits */}
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-bold text-center mb-6">Why Standards Alignment Matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-yellow-900" />
              </div>
              <h4 className="font-semibold mb-2">Quality Assurance</h4>
              <p className="text-sm text-indigo-100">
                Ensures curriculum meets rigorous educational quality standards and learning outcomes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-green-900" />
              </div>
              <h4 className="font-semibold mb-2">Global Recognition</h4>
              <p className="text-sm text-indigo-100">
                Facilitates seamless transitions between educational systems worldwide
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-900" />
              </div>
              <h4 className="font-semibold mb-2">Learning Progression</h4>
              <p className="text-sm text-indigo-100">
                Provides clear developmental pathways and measurable learning objectives
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-K Curriculum Structure Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{curriculumStructure.title}</h2>
          <p className="text-purple-100">{curriculumStructure.subtitle}</p>
        </div>
        
        <div className="p-6">
          {/* Learning Hours Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Stage</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Age Group</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Weekly Learning Hours</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Annual Learning Hours</th>
                </tr>
              </thead>
              <tbody>
                {curriculumStructure.stages.map((stage, index) => {
                  const colors = ['blue', 'teal', 'purple'];
                  const color = colors[index % colors.length];
                  return (
                    <tr key={stage.id} className={`hover:bg-${color}-50 transition-colors`}>
                      <td className={`border border-gray-200 px-4 py-3 font-medium text-${color}-700`}>{stage.name}</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">{stage.ageGroup}</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">{stage.weeklyHours}</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">{stage.annualHours}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Curriculum Notes */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Curriculum Notes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curriculumStructure.notes.map((note) => {
                const IconComponent = getIconComponent(note.icon);
                return (
                  <div key={note.id} className={`bg-${note.color}-50 border border-${note.color}-200 rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 bg-${note.color}-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-${note.color}-900 mb-2`}>{note.title}</h4>
                        <p className={`text-${note.color}-800 text-sm leading-relaxed`}>
                          {note.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Student Books Section */}
      <section>
        <SectionHeader 
          title="Student Books" 
          count={studentBooks.length}
          selectedCount={totals.selectedStudentBooks}
          icon={BookOpen}
          color="bg-blue-600"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studentBooks.map(book => (
            <BookCard key={book.id} book={book} type="student" />
          ))}
        </div>
      </section>

      {/* Practice Books Section */}
      <section>
        <SectionHeader 
          title="Practice Books" 
          count={practiceBooks.length}
          selectedCount={totals.selectedPracticeBooks}
          icon={Target}
          color="bg-orange-600"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {practiceBooks.map(book => (
            <BookCard key={book.id} book={book} type="practice" />
          ))}
        </div>
      </section>

      {/* Teacher Guides Section */}
      <section>
        <SectionHeader 
          title="Teacher Guides" 
          count={teacherGuides.length}
          selectedCount={totals.selectedTeacherGuides}
          icon={GraduationCap}
          color="bg-teal-600"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teacherGuides.filter(book => book.isTeacherGuide).map(book => (
            <BookCard key={book.id} book={book} type="teacher" />
          ))}
        </div>
        {teacherGuides.filter(book => book.isTeacherGuide).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No teacher guides available yet.</p>
            <p className="text-sm">Teacher guides will appear here when added to the curriculum.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CurriculumCards;