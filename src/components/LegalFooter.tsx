import React from 'react';
import { Shield, AlertTriangle, Copyright } from 'lucide-react';

const LegalFooter: React.FC = () => {
  return (
    <div className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Copyright */}
          <div className="flex items-start space-x-3">
            <Copyright className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white mb-2">Copyright Notice</h4>
              <p className="text-sm leading-relaxed">
                © 2025 KODEIT. All rights reserved. This cost calculator and its contents are proprietary and confidential. 
                Unauthorized reproduction, distribution, or sharing is strictly prohibited.
              </p>
            </div>
          </div>

          {/* Confidentiality */}
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white mb-2">Confidentiality</h4>
              <p className="text-sm leading-relaxed">
                This calculator contains confidential business information. By using this tool, you agree not to 
                share, copy, or distribute any pricing information or calculations without written permission from KODEIT.
              </p>
            </div>
          </div>

          {/* Pricing Disclaimer */}
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white mb-2">Pricing Disclaimer</h4>
              <p className="text-sm leading-relaxed">
                All pricing shown is indicative and subject to change without notice. Final pricing may vary based on 
                specific requirements, volume, location, and current market conditions. This is not a binding quote.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>
                <strong>IMPORTANT:</strong> This tool is for authorized personnel only. 
                Screenshots, copying, or sharing of this content is prohibited and may result in legal action.
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <p>KODEIT Pre-K Curriculum Cost Calculator v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalFooter;