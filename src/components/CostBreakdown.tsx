import React from 'react';
import { Download, Mail, RotateCcw, Calculator, AlertTriangle, Shield } from 'lucide-react';
import ContactModal from './ContactModal';
import { generatePDF, sendEmailQuote } from '../utils/notifications';
import { formatCurrency, convertCurrency } from '../utils/calculations';
import { CostBreakdownItem, CurriculumLevel } from '../types';

interface CostBreakdownProps {
  items: CostBreakdownItem[];
  total: number;
  currency: string;
  exchangeRate: number;
  curriculum: CurriculumLevel[];
  onReset: () => void;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({
  items,
  total,
  currency,
  exchangeRate,
  curriculum,
  onReset
}) => {
  const [contactModal, setContactModal] = React.useState<{ isOpen: boolean; type: 'pdf' | 'email' | null }>({
    isOpen: false,
    type: null
  });

  const handleCloseModal = () => {
    setContactModal({ isOpen: false, type: null });
  };

  const handleContactSubmit = async (contactData: { name: string; email: string }) => {
    const costData = {
      items,
      total: convertCurrency(total, exchangeRate),
      currency
    };

    if (contactModal.type === 'pdf') {
      await generatePDF(contactData, costData);
    } else if (contactModal.type === 'email') {
      await sendEmailQuote(contactData, costData);
    }
  };

  // Helper function to get book details including ISBN
  const getBookDetails = (bookId?: string) => {
    if (!bookId) return null;
    
    for (const level of curriculum) {
      const book = level.books.find(b => b.id === bookId);
      if (book) return book;
    }
    return null;
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const studentBooks = items.filter(item => item.type === 'book');
    const teacherGuides = items.filter(item => item.type === 'guide');
    const brandingItems = items.filter(item => item.type === 'branding');

    return {
      totalStudentBooks: studentBooks.reduce((sum, item) => sum + item.quantity, 0),
      totalTeacherGuides: teacherGuides.reduce((sum, item) => sum + item.quantity, 0),
      uniqueStudentBooks: studentBooks.length,
      uniqueTeacherGuides: teacherGuides.length,
      studentBooksSubtotal: studentBooks.reduce((sum, item) => sum + item.subtotal, 0),
      teacherGuidesSubtotal: teacherGuides.reduce((sum, item) => sum + item.subtotal, 0),
      brandingCost: brandingItems.reduce((sum, item) => sum + item.subtotal, 0)
    };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Make your selections to see the cost breakdown</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Cost Breakdown ({currency})
        </h3>
      </div>
      
      {/* Statistics Summary */}
      <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalStudentBooks}</div>
            <div className="text-sm text-blue-800">Total Student Books</div>
            <div className="text-xs text-blue-600">({stats.uniqueStudentBooks} unique titles)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{stats.totalTeacherGuides}</div>
            <div className="text-sm text-teal-800">Total Teacher Guides</div>
            <div className="text-xs text-teal-600">({stats.uniqueTeacherGuides} unique titles)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(convertCurrency(stats.studentBooksSubtotal, exchangeRate), currency)}
            </div>
            <div className="text-sm text-blue-800">Student Books Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {formatCurrency(convertCurrency(stats.teacherGuidesSubtotal, exchangeRate), currency)}
            </div>
            <div className="text-sm text-teal-800">Teacher Guides Total</div>
          </div>
        </div>
        {stats.brandingCost > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {formatCurrency(convertCurrency(stats.brandingCost, exchangeRate), currency)}
              </div>
              <div className="text-sm text-purple-800">Branding Premium</div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => {
              const bookDetails = getBookDetails(item.bookId);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        item.type === 'book' ? 'bg-blue-500' :
                        item.type === 'guide' ? 'bg-teal-500' : 'bg-orange-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {bookDetails?.isbn && (
                          <div className="text-xs text-gray-500 font-mono">ISBN: {bookDetails.isbn}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">
                    {formatCurrency(convertCurrency(item.unitPrice, exchangeRate), currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(convertCurrency(item.subtotal, exchangeRate), currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                Total:
              </td>
              <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                {formatCurrency(convertCurrency(total, exchangeRate), currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-t border-yellow-200 p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>For print books, logistics costs may be calculated based on actual shipping requirements</li>
              <li>Government taxes and duties are not included in the above pricing</li>
              <li>Final pricing may vary based on specific requirements and location</li>
              <li>All pricing is indicative and subject to change without notice</li>
              <li>This is not a binding quote - final terms subject to formal agreement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-red-50 border-t border-red-200 p-4">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-medium mb-1">Confidential Information:</p>
            <p className="text-xs">
              This pricing information is confidential and proprietary. Screenshots, copying, or sharing 
              of this content without written permission is strictly prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setContactModal({ isOpen: true, type: 'pdf' })}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate PDF</span>
          </button>
          
          <button
            onClick={() => setContactModal({ isOpen: true, type: 'email' })}
            className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email Quote</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <ContactModal
        isOpen={contactModal.isOpen}
        type={contactModal.type}
        onClose={handleCloseModal}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
};

export default CostBreakdown;