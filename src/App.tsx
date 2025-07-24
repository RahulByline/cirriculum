import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Calculator, Settings, Eye } from 'lucide-react';
import ContentProtection from './components/ContentProtection';
import AdminAuth from './components/AdminAuth';
import LegalFooter from './components/LegalFooter';
import CurriculumCards from './components/CurriculumCards';
import CostCalculator from './components/CostCalculator';
import AdminPanel from './components/AdminPanel';
import CurriculumViewer from './components/CurriculumViewer';
import { curriculumData, pricing as defaultPricing } from './data/curriculum';
import { curriculumStructure as defaultCurriculumStructure } from './data/curriculum';
import { 
  savePricingToServer, 
  loadPricingFromServer, 
  saveCurriculumToServer, 
  loadCurriculumFromServer,
  saveCurriculumStructureToServer,
  loadCurriculumStructureFromServer,
  subscribeToAdminChanges
} from './utils/adminStorage';
import { normalizeCurriculum } from './utils/dataNormalization';
import { CurriculumLevel, PricingConfig, CurriculumStructureConfig } from './types';
import './utils/dataMigration'; // Import migration utility for browser console access

// Deep merge function to ensure all nested properties are present
const deepMergePricing = (serverPricing: any, defaultPricing: PricingConfig): PricingConfig => {
  if (!serverPricing) return defaultPricing;
  
  return {
    ...defaultPricing,
    ...serverPricing,
    studentBook: {
      ...defaultPricing.studentBook,
      ...(serverPricing.studentBook || {})
    },
    practiceBook: {
      ...defaultPricing.practiceBook,
      ...(serverPricing.practiceBook || {})
    },
    teacherGuide: {
      ...defaultPricing.teacherGuide,
      ...(serverPricing.teacherGuide || {})
    },
    branding: {
      ...defaultPricing.branding,
      ...(serverPricing.branding || {})
    }
  };
};

function App() {
  // Admin state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCurriculumViewerOpen, setIsCurriculumViewerOpen] = useState(false);
  const [isCostCalculatorOpen, setIsCostCalculatorOpen] = useState(false);
  const [pricing, setPricing] = useState<PricingConfig>(defaultPricing);
  const [curriculum, setCurriculum] = useState<CurriculumLevel[]>(curriculumData);
  const [curriculumStructure, setCurriculumStructure] = useState<CurriculumStructureConfig>(defaultCurriculumStructure);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection state for home page
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);

  // Load initial data from server
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [serverPricing, serverCurriculum, serverCurriculumStructure] = await Promise.all([
          loadPricingFromServer(),
          loadCurriculumFromServer(),
          loadCurriculumStructureFromServer()
        ]);
        
        if (serverPricing) {
          setPricing(deepMergePricing(serverPricing, defaultPricing));
        }
        
        if (serverCurriculum) {
          setCurriculum(normalizeCurriculum(serverCurriculum));
        }
        
        if (serverCurriculumStructure) {
          setCurriculumStructure(serverCurriculumStructure);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const subscription = subscribeToAdminChanges(
      (newPricing) => {
        console.log('Pricing updated from server:', newPricing);
        setPricing(deepMergePricing(newPricing, defaultPricing));
      },
      (newCurriculum) => {
        console.log('Curriculum updated from server:', newCurriculum);
        setCurriculum(normalizeCurriculum(newCurriculum));
      },
      (newCurriculumStructure) => {
        console.log('Curriculum structure updated from server:', newCurriculumStructure);
        setCurriculumStructure(newCurriculumStructure);
      }
    );

    return () => {
      
    };
  }, []);

  // Handle admin updates
  const handleUpdatePricing = async (newPricing: PricingConfig) => {
    const mergedPricing = deepMergePricing(newPricing, defaultPricing);
    setPricing(mergedPricing);
    await savePricingToServer(newPricing);
  };

  const handleUpdateCurriculum = async (newCurriculum: CurriculumLevel[]) => {
    const normalizedCurriculum = normalizeCurriculum(newCurriculum);
    setCurriculum(normalizedCurriculum);
    await saveCurriculumToServer(newCurriculum);
  };

  const handleUpdateCurriculumStructure = async (newStructure: CurriculumStructureConfig) => {
    setCurriculumStructure(newStructure);
    await saveCurriculumStructureToServer(newStructure);
  };

  // Handle book selection from home page
  const handleBookToggle = (bookId: string, levelId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleGuideToggle = (bookId: string, levelId: string) => {
    setSelectedGuides(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <ContentProtection>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading curriculum data...</p>
          </div>
        </div>
      </ContentProtection>
    );
  }

  return (
    <ContentProtection>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">KODEIT Pre-K</h1>
                  <p className="text-sm text-gray-600">Curriculum Overview</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsCostCalculatorOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Cost Calculator"
                >
                  <Calculator className="w-4 h-4" />
                  <span className="hidden sm:inline">Cost Calculator</span>
                </button>
                <button
                  onClick={() => setIsCurriculumViewerOpen(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Curriculum"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View Curriculum</span>
                </button>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Admin Panel"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CurriculumCards 
            curriculum={curriculum}
          curriculumStructure={curriculumStructure}
            selectedBooks={selectedBooks}
            selectedGuides={selectedGuides}
            onBookToggle={handleBookToggle}
            onGuideToggle={handleGuideToggle}
          />
        </div>

        {/* Cost Calculator Modal */}
        <CostCalculator
          isOpen={isCostCalculatorOpen}
          onClose={() => setIsCostCalculatorOpen(false)}
          curriculum={curriculum}
          pricing={pricing}
          initialSelectedBooks={selectedBooks}
          initialSelectedGuides={selectedGuides}
        />

        {/* Admin Panel - Only show auth when panel is opened */}
        {isAdminOpen && (
          <AdminAuth requireAuth={true}>
            <AdminPanel
              isOpen={isAdminOpen}
              onClose={() => setIsAdminOpen(false)}
              pricing={pricing}
              curriculum={curriculum}
              curriculumStructure={curriculumStructure}
              onUpdatePricing={handleUpdatePricing}
              onUpdateCurriculum={handleUpdateCurriculum}
              onUpdateCurriculumStructure={handleUpdateCurriculumStructure}
            />
          </AdminAuth>
        )}

        {/* Curriculum Viewer */}
        <CurriculumViewer
          isOpen={isCurriculumViewerOpen}
          onClose={() => setIsCurriculumViewerOpen(false)}
          curriculum={curriculum}
        />
      </div>
      
      {/* Legal Footer */}
      <LegalFooter />
    </ContentProtection>
  );
}

export default App;