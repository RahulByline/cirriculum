import React, { useState } from 'react';
import { Settings, Save, X, DollarSign, Percent, BookOpen, LogOut, Plus } from 'lucide-react';
import { PricingConfig, CurriculumLevel, CurriculumStructureConfig } from '../types';
import AdminAuth from './AdminAuth';
import CurriculumEditor from './CurriculumEditor';
import CurriculumStructureEditor from './CurriculumStructureEditor';
import BookManager from './BookManager';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingConfig;
  curriculum: CurriculumLevel[];
  curriculumStructure: CurriculumStructureConfig;
  onUpdatePricing: (pricing: PricingConfig) => void;
  onUpdateCurriculum: (curriculum: CurriculumLevel[]) => void;
  onUpdateCurriculumStructure: (structure: CurriculumStructureConfig) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  pricing,
  curriculum,
  curriculumStructure,
  onUpdatePricing,
  onUpdateCurriculum,
  onUpdateCurriculumStructure
}) => {
  const [localPricing, setLocalPricing] = useState<PricingConfig>(pricing);
  const [localCurriculum, setLocalCurriculum] = useState<CurriculumLevel[]>(curriculum);
  const [localCurriculumStructure, setLocalCurriculumStructure] = useState<CurriculumStructureConfig>(curriculumStructure);
  const [activeTab, setActiveTab] = useState<'pricing' | 'books' | 'curriculum' | 'structure' | 'manage'>('pricing');

  // Don't show panel if not open
  if (!isOpen) return null;

  const handleSave = () => {
    Promise.all([
      onUpdatePricing(localPricing),
      onUpdateCurriculum(localCurriculum),
      onUpdateCurriculumStructure(localCurriculumStructure)
    ]).then(() => {
      // Show success message
      alert('Settings saved successfully! Changes will be applied for all users across all instances.');
      onClose();
    }).catch((error) => {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    });
  };

  const updateBookName = (levelId: string, bookId: string, newName: string) => {
    setLocalCurriculum(prev => prev.map(level => 
      level.id === levelId 
        ? {
            ...level,
            books: level.books.map(book => 
              book.id === bookId ? { ...book, name: newName } : book
            )
          }
        : level
    ));
  };

  const updateBookDescription = (levelId: string, bookId: string, newDescription: string) => {
    setLocalCurriculum(prev => prev.map(level => 
      level.id === levelId 
        ? {
            ...level,
            books: level.books.map(book => 
              book.id === bookId ? { ...book, description: newDescription } : book
            )
          }
        : level
    ));
  };

  const updateBookHyperlink = (levelId: string, bookId: string, newHyperlink: string) => {
    setLocalCurriculum(prev => prev.map(level => 
      level.id === levelId 
        ? {
            ...level,
            books: level.books.map(book => 
              book.id === bookId ? { ...book, hyperlink: newHyperlink } : book
            )
          }
        : level
    ));
  };

  const updateBookISBN = (levelId: string, bookId: string, newISBN: string) => {
    setLocalCurriculum(prev => prev.map(level => 
      level.id === levelId 
        ? {
            ...level,
            books: level.books.map(book => 
              book.id === bookId ? { ...book, isbn: newISBN } : book
            )
          }
        : level
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pricing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-1" />
                Pricing
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'books'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-1" />
                Books
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'curriculum'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Curriculum
              </button>
              <button
                onClick={() => setActiveTab('structure')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'structure'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Structure
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Manage Books
              </button>
            </nav>
          </div>

          {/* Pricing Configuration */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing Configuration
            </h3>

            {/* Student Book Pricing */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Student Book Pricing (USD)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Digital</label>
                  <input
                    type="number"
                    value={localPricing.studentBook.digital}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      studentBook: { ...prev.studentBook, digital: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Print</label>
                  <input
                    type="number"
                    value={localPricing.studentBook.print}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      studentBook: { ...prev.studentBook, print: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Both</label>
                  <input
                    type="number"
                    value={localPricing.studentBook.both}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      studentBook: { ...prev.studentBook, both: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Practice Book Pricing */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-3">Practice Book Pricing (USD)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-1">Digital</label>
                  <input
                    type="number"
                    value={localPricing.practiceBook.digital}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      practiceBook: { ...prev.practiceBook, digital: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-1">Print</label>
                  <input
                    type="number"
                    value={localPricing.practiceBook.print}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      practiceBook: { ...prev.practiceBook, print: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-1">Both</label>
                  <input
                    type="number"
                    value={localPricing.practiceBook.both}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      practiceBook: { ...prev.practiceBook, both: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Teacher Guide Pricing */}
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-teal-900 mb-3">Teacher Guide Pricing (USD)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-800 mb-1">Digital</label>
                  <input
                    type="number"
                    value={localPricing.teacherGuide.digital}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      teacherGuide: { ...prev.teacherGuide, digital: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-800 mb-1">Print</label>
                  <input
                    type="number"
                    value={localPricing.teacherGuide.print}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      teacherGuide: { ...prev.teacherGuide, print: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-800 mb-1">Both</label>
                  <input
                    type="number"
                    value={localPricing.teacherGuide.both}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      teacherGuide: { ...prev.teacherGuide, both: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Branding Multipliers */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                <Percent className="w-4 h-4 mr-2" />
                Branding Multipliers
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">Co-branded Multiplier</label>
                  <input
                    type="number"
                    step="0.01"
                    value={localPricing.branding.cobranded}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      branding: { ...prev.branding, cobranded: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-purple-700 mt-1">
                    Current: +{Math.round((localPricing.branding.cobranded - 1) * 100)}%
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">White-labeled Multiplier</label>
                  <input
                    type="number"
                    step="0.01"
                    value={localPricing.branding.whitelabeled}
                    onChange={(e) => setLocalPricing(prev => ({
                      ...prev,
                      branding: { ...prev.branding, whitelabeled: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-purple-700 mt-1">
                    Current: +{Math.round((localPricing.branding.whitelabeled - 1) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Curriculum Editor */}
          {activeTab === 'curriculum' && (
            <CurriculumEditor
              curriculum={localCurriculum}
              onUpdateCurriculum={setLocalCurriculum}
            />
          )}

          {/* Curriculum Structure Editor */}
          {activeTab === 'structure' && (
            <CurriculumStructureEditor
              structure={localCurriculumStructure}
              onUpdateStructure={setLocalCurriculumStructure}
            />
          )}

          {/* Book Management */}
          {activeTab === 'manage' && (
            <BookManager
              curriculum={localCurriculum}
              onUpdateCurriculum={setLocalCurriculum}
            />
          )}

          {/* Curriculum Configuration */}
          {activeTab === 'books' && (
            <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Book Configuration
            </h3>

            {localCurriculum.map(level => (
              <div key={level.id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">{level.name}</h4>
                <div className="space-y-2">
                  {level.books.map(book => (
                    <div key={book.id} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-16 font-medium">{book.id}:</span>
                        <div className="flex-1 space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Book Name</label>
                            <input
                              type="text"
                              value={book.name}
                              onChange={(e) => updateBookName(level.id, book.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                            <input
                              type="text"
                              value={book.description}
                              onChange={(e) => updateBookDescription(level.id, book.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Hyperlink (optional)</label>
                            <input
                              type="url"
                              value={book.hyperlink || ''}
                              onChange={(e) => updateBookHyperlink(level.id, book.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://example.com/book-link"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Link to view or purchase this book
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">ISBN</label>
                            <input
                              type="text"
                              value={book.isbn || ''}
                              onChange={(e) => updateBookISBN(level.id, book.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="978-0-123456-78-9"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              International Standard Book Number
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Structure Summary</label>
                            <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="font-medium">Units:</span> {book.units.length}
                                  <div className="text-xs mt-1">
                                    {book.units.map((unit, idx) => (
                                      <div key={idx}>• {unit.name || 'Unnamed Unit'}</div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Total Lessons:</span> {book.units.reduce((total, unit) => total + unit.lessons.length, 0)}
                                  <div className="text-xs mt-1">
                                    {book.units.map((unit, idx) => (
                                      <div key={idx}>{unit.name}: {unit.lessons.length} lessons</div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                              Use the Curriculum tab to edit units and lessons structure
                            </p>
                          </div>
                          {book.isPracticeBook && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                              <span className="text-xs text-yellow-800 font-medium">Practice Book - No Teacher Guide Available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={activeTab === 'curriculum'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
           disabled={activeTab === 'curriculum' || activeTab === 'structure' || activeTab === 'manage'}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          {(activeTab === 'curriculum' || activeTab === 'structure' || activeTab === 'manage') && (
            <div className="text-sm text-gray-600">
              Use the Save button in the {activeTab === 'manage' ? 'book manager' : activeTab} editor to save individual changes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;