import React, { useState, useEffect } from 'react';
import { X, Calculator, RotateCcw } from 'lucide-react';
import CurriculumSelector from './CurriculumSelector';
import QuantityInputs from './QuantityInputs';
import FormatSelector from './FormatSelector';
import BrandingSelector from './BrandingSelector';
import CurrencySelector from './CurrencySelector';
import CostBreakdown from './CostBreakdown';
import { calculateCosts, getExchangeRates } from '../utils/calculations';
import { SelectedItem, FormatType, BrandingType, CostBreakdownItem, CurriculumLevel, PricingConfig } from '../types';

interface CostCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: CurriculumLevel[];
  pricing: PricingConfig;
  initialSelectedBooks?: string[];
  initialSelectedGuides?: string[];
}

const CostCalculator: React.FC<CostCalculatorProps> = ({
  isOpen,
  onClose,
  curriculum,
  pricing,
  initialSelectedBooks = [],
  initialSelectedGuides = [],
}) => {
  // Selection state
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>(initialSelectedBooks);
  const [selectedGuides, setSelectedGuides] = useState<string[]>(initialSelectedGuides);
  const [studentCount, setStudentCount] = useState<number>(25);
  const [teacherCount, setTeacherCount] = useState<number>(1);
  const [format, setFormat] = useState<FormatType>('digital');
  const [branding, setBranding] = useState<BrandingType>('kodeit');
  const [currency, setCurrency] = useState<string>('USD');
  const [exchangeRates] = useState(getExchangeRates());
  const [costBreakdown, setCostBreakdown] = useState<{items: CostBreakdownItem[], total: number}>({
    items: [],
    total: 0
  });

  // Update selections when props change
  useEffect(() => {
    setSelectedBooks(initialSelectedBooks);
    setSelectedGuides(initialSelectedGuides);
  }, [initialSelectedBooks, initialSelectedGuides]);

  // Handle level selection
  const handleLevelToggle = (levelId: string) => {
    const level = curriculum.find(l => l.id === levelId);
    if (!level) return;

    // Separate student/practice books from teacher guide books
    const studentBookIds = level.books.filter(b => !b.isTeacherGuide).map(b => b.id);
    const teacherGuideIds = level.books.filter(b => b.isTeacherGuide).map(b => b.id);
    
    if (selectedLevels.includes(levelId)) {
      // Remove level
      setSelectedLevels(prev => prev.filter(id => id !== levelId));
      setSelectedBooks(prev => prev.filter(id => !studentBookIds.includes(id)));
      setSelectedGuides(prev => prev.filter(id => !teacherGuideIds.includes(id)));
    } else {
      // Add level
      setSelectedLevels(prev => [...prev, levelId]);
      setSelectedBooks(prev => [...new Set([...prev, ...studentBookIds])]);
      setSelectedGuides(prev => [...new Set([...prev, ...teacherGuideIds])]);
    }
  };

  // Handle individual book selection
  const handleBookToggle = (bookId: string, levelId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(prev => prev.filter(id => id !== bookId));
      // Check if this affects level selection
      const level = curriculum.find(l => l.id === levelId);
      if (level) {
        const allBooksSelected = level.books.every(b => 
          b.id === bookId || selectedBooks.includes(b.id)
        );
        if (allBooksSelected && selectedLevels.includes(levelId)) {
          setSelectedLevels(prev => prev.filter(id => id !== levelId));
        }
      }
    } else {
      setSelectedBooks(prev => [...prev, bookId]);
    }
  };

  // Handle individual guide selection
  const handleGuideToggle = (bookId: string, levelId: string) => {
    if (selectedGuides.includes(bookId)) {
      setSelectedGuides(prev => prev.filter(id => id !== bookId));
      // Check if this affects level selection
      const level = curriculum.find(l => l.id === levelId);
      if (level) {
        const allGuidesSelected = level.books.every(b => 
          b.id === bookId || selectedGuides.includes(b.id)
        );
        if (allGuidesSelected && selectedLevels.includes(levelId)) {
          setSelectedLevels(prev => prev.filter(id => id !== levelId));
        }
      }
    } else {
      setSelectedGuides(prev => [...prev, bookId]);
    }
  };

  // Calculate costs whenever selections change
  useEffect(() => {
    console.log('Recalculating costs with pricing:', pricing);
    
    const selectedBookItems: SelectedItem[] = selectedBooks.map(bookId => ({
      type: 'book',
      bookId,
      levelId: curriculum.find(l => l.books.some(b => b.id === bookId))?.id || '',
      quantity: studentCount
    }));

    const selectedGuideItems: SelectedItem[] = selectedGuides.map(bookId => ({
      type: 'guide',
      bookId,
      levelId: curriculum.find(l => l.books.some(b => b.id === bookId))?.id || '',
      quantity: teacherCount
    }));

    const costs = calculateCosts(selectedBookItems, selectedGuideItems, format, branding, pricing, curriculum);
    console.log('Calculated costs:', costs);
    setCostBreakdown(costs);
  }, [selectedBooks, selectedGuides, studentCount, teacherCount, format, branding, pricing, curriculum]);

  const handleReset = () => {
    setSelectedLevels([]);
    setSelectedBooks([]);
    setSelectedGuides([]);
    setStudentCount(25);
    setTeacherCount(1);
    setFormat('digital');
    setBranding('kodeit');
    setCurrency('USD');
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${!isOpen ? 'hidden' : ''}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">Cost Calculator</h2>
              <p className="text-green-100 text-sm">Calculate pricing for your curriculum needs</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4 text-white">
              <div className="text-sm">
                <span className="font-medium">{selectedBooks.length}</span> books selected
              </div>
              <div className="text-sm">
                Total: <span className="font-bold">{costBreakdown.total > 0 ? `${costBreakdown.total.toLocaleString()} ${currency}` : `0 ${currency}`}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Top Row - Selections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <CurriculumSelector
                  levels={curriculum}
                  selectedLevels={selectedLevels}
                  selectedBooks={selectedBooks}
                  selectedGuides={selectedGuides}
                  onLevelToggle={handleLevelToggle}
                  onBookToggle={handleBookToggle}
                  onGuideToggle={handleGuideToggle}
                />
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <QuantityInputs
                    studentCount={studentCount}
                    teacherCount={teacherCount}
                    onStudentCountChange={setStudentCount}
                    onTeacherCountChange={setTeacherCount}
                  />
                </div>
                
                <CurrencySelector
                  selectedCurrency={currency}
                  onCurrencyChange={setCurrency}
                  exchangeRates={exchangeRates}
                />
              </div>
            </div>

            {/* Middle Row - Format and Branding */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <FormatSelector
                  selectedFormat={format}
                  onFormatChange={setFormat}
                  pricing={pricing}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <BrandingSelector
                  selectedBranding={branding}
                  onBrandingChange={setBranding}
                  studentCount={studentCount}
                />
              </div>
            </div>

            {/* Bottom Row - Cost Breakdown */}
            <div className="max-w-4xl mx-auto">
              <CostBreakdown
                items={costBreakdown.items}
                total={costBreakdown.total}
                currency={currency}
                exchangeRate={exchangeRates[currency]}
                curriculum={curriculum}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Configure your selections above to see detailed pricing breakdown
            </div>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;