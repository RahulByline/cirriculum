import React from 'react';
import { Users, User } from 'lucide-react';

interface QuantityInputsProps {
  studentCount: number;
  teacherCount: number;
  onStudentCountChange: (count: number) => void;
  onTeacherCountChange: (count: number) => void;
}

const QuantityInputs: React.FC<QuantityInputsProps> = ({
  studentCount,
  teacherCount,
  onStudentCountChange,
  onTeacherCountChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity Requirements</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-medium text-blue-900">
              Number of Students
            </label>
          </div>
          <input
            type="number"
            min="1"
            max="1000"
            value={studentCount}
            onChange={(e) => onStudentCountChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter student count"
          />
          <p className="text-xs text-blue-700 mt-1">
            Each student receives one copy of each selected book
          </p>
        </div>
        
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-teal-600" />
            <label className="text-sm font-medium text-teal-900">
              Number of Teachers
            </label>
          </div>
          <input
            type="number"
            min="1"
            max="100"
            value={teacherCount}
            onChange={(e) => onTeacherCountChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Enter teacher count"
          />
          <p className="text-xs text-teal-700 mt-1">
            Each teacher receives one copy of each selected guide
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantityInputs;