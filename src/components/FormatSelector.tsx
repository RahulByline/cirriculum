import React from 'react';
import { Monitor, Printer, Package } from 'lucide-react';
import { FormatType, PricingConfig } from '../types';
import { formatCurrency } from '../utils/calculations';

interface FormatSelectorProps {
  selectedFormat: FormatType;
  onFormatChange: (format: FormatType) => void;
  pricing: PricingConfig;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  pricing
}) => {
  const formats = [
    {
      id: 'digital' as FormatType,
      name: 'Digital Only',
      icon: Monitor,
      description: 'Online access and downloads',
      studentPrice: formatCurrency(pricing.studentBook.digital),
      teacherPrice: formatCurrency(pricing.teacherGuide.digital),
      practicePrice: formatCurrency(pricing.practiceBook.digital)
    },
    {
      id: 'print' as FormatType,
      name: 'Print Only',
      icon: Printer,
      description: 'Physical books shipped',
      studentPrice: formatCurrency(pricing.studentBook.print),
      teacherPrice: formatCurrency(pricing.teacherGuide.print),
      practicePrice: formatCurrency(pricing.practiceBook.print)
    },
    {
      id: 'both' as FormatType,
      name: 'Digital + Print',
      icon: Package,
      description: 'Both formats included',
      studentPrice: formatCurrency(pricing.studentBook.both),
      teacherPrice: formatCurrency(pricing.teacherGuide.both),
      practicePrice: formatCurrency(pricing.practiceBook.both)
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Format Selection</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map(format => {
          const Icon = format.icon;
          const isSelected = selectedFormat === format.id;
          
          return (
            <div key={format.id} className="relative">
              <input
                type="radio"
                id={format.id}
                name="format"
                value={format.id}
                checked={isSelected}
                onChange={() => onFormatChange(format.id)}
                className="sr-only"
              />
              <label
                htmlFor={format.id}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{format.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Student Books:</span>
                    <span className="font-medium">{format.studentPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Practice Books:</span>
                    <span className="font-medium">{format.practicePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teacher Guides:</span>
                    <span className="font-medium">{format.teacherPrice}</span>
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormatSelector;