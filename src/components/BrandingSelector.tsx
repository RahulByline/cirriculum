import React from 'react';
import { Tag, Palette, Eye } from 'lucide-react';
import { BrandingType } from '../types';

interface BrandingSelectorProps {
  selectedBranding: BrandingType;
  onBrandingChange: (branding: BrandingType) => void;
  studentCount: number;
}

const BrandingSelector: React.FC<BrandingSelectorProps> = ({
  selectedBranding,
  onBrandingChange,
  studentCount
}) => {
  const minimumStudentsForPremium = 150;
  const isPremiumEnabled = studentCount >= minimumStudentsForPremium;

  const brandingOptions = [
    {
      id: 'kodeit' as BrandingType,
      name: 'KODEIT Branded',
      icon: Tag,
      description: 'Standard KODEIT branding',
      multiplier: 'Base Price',
      color: 'gray',
      enabled: true
    },
    {
      id: 'cobranded' as BrandingType,
      name: 'Co-branded',
      icon: Palette,
      description: 'Your logo with KODEIT',
      multiplier: isPremiumEnabled ? 'Premium Option' : `Requires ${minimumStudentsForPremium}+ students`,
      color: 'orange',
      enabled: isPremiumEnabled
    },
    {
      id: 'whitelabeled' as BrandingType,
      name: 'White-labeled',
      icon: Eye,
      description: 'Your branding only',
      multiplier: isPremiumEnabled ? 'Premium Option' : `Requires ${minimumStudentsForPremium}+ students`,
      color: 'purple',
      enabled: isPremiumEnabled
    }
  ];

  // Auto-switch to KODEIT branded if premium options are disabled and currently selected
  React.useEffect(() => {
    if (!isPremiumEnabled && (selectedBranding === 'cobranded' || selectedBranding === 'whitelabeled')) {
      onBrandingChange('kodeit');
    }
  }, [isPremiumEnabled, selectedBranding, onBrandingChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Branding Options</h3>
        {!isPremiumEnabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
            <span className="text-blue-800 text-sm font-medium">
              Premium branding available with {minimumStudentsForPremium}+ students
            </span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brandingOptions.map(option => {
          const Icon = option.icon;
          const isSelected = selectedBranding === option.id;
          const isDisabled = !option.enabled;
          
          return (
            <div key={option.id} className="relative">
              <input
                type="radio"
                id={option.id}
                name="branding"
                value={option.id}
                checked={isSelected}
                onChange={() => option.enabled && onBrandingChange(option.id)}
                disabled={isDisabled}
                className="sr-only"
              />
              <label
                htmlFor={option.id}
                className={`block p-4 rounded-lg border-2 transition-all ${
                  isDisabled 
                    ? 'cursor-not-allowed opacity-60 bg-gray-50 border-gray-200' 
                    : 'cursor-pointer'
                } ${
                  isSelected
                    ? `border-${option.color}-500 bg-${option.color}-50 ring-2 ring-${option.color}-200`
                    : isDisabled 
                      ? 'border-gray-200' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-5 h-5 ${
                    isSelected ? `text-${option.color}-600` : 
                    isDisabled ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`font-medium ${
                    isSelected ? `text-${option.color}-900` : 
                    isDisabled ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {option.name}
                  </span>
                  {isDisabled && (
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                      Locked
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-3 ${
                  isDisabled ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {option.description}
                </p>
                <div className={`text-sm font-medium ${
                  isSelected ? `text-${option.color}-700` : 
                  isDisabled ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {option.multiplier}
                </div>
                {isDisabled && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Increase student count to {minimumStudentsForPremium} or more to unlock this option
                    </p>
                  </div>
                )}
              </label>
            </div>
          );
        })}
      </div>
      
      {!isPremiumEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Premium Branding Options</p>
              <p>
                Co-branded and White-labeled options are available for orders of {minimumStudentsForPremium} students or more. 
                These premium branding options include additional customization and setup services.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandingSelector;