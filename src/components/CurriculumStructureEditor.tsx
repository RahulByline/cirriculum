import React, { useState } from 'react';
import { Plus, Minus, Save, RotateCcw, Edit3, Table, FileText } from 'lucide-react';
import { CurriculumStructureConfig, CurriculumStructureStage, CurriculumStructureNote } from '../types';

interface CurriculumStructureEditorProps {
  structure: CurriculumStructureConfig;
  onUpdateStructure: (structure: CurriculumStructureConfig) => void;
}

const CurriculumStructureEditor: React.FC<CurriculumStructureEditorProps> = ({
  structure,
  onUpdateStructure
}) => {
  const [localStructure, setLocalStructure] = useState<CurriculumStructureConfig>({
    ...structure,
    stages: structure.stages.map(s => ({ ...s })),
    notes: structure.notes.map(n => ({ ...n }))
  });

  const updateTitle = (title: string) => {
    setLocalStructure(prev => ({ ...prev, title }));
  };

  const updateSubtitle = (subtitle: string) => {
    setLocalStructure(prev => ({ ...prev, subtitle }));
  };

  const addStage = () => {
    const newStage: CurriculumStructureStage = {
      id: `stage_${Date.now()}`,
      name: '',
      ageGroup: '',
      weeklyHours: '',
      annualHours: ''
    };
    setLocalStructure(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
  };

  const removeStage = (stageId: string) => {
    setLocalStructure(prev => ({
      ...prev,
      stages: prev.stages.filter(s => s.id !== stageId)
    }));
  };

  const updateStage = (stageId: string, field: keyof CurriculumStructureStage, value: string) => {
    setLocalStructure(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const addNote = () => {
    const newNote: CurriculumStructureNote = {
      id: `note_${Date.now()}`,
      title: '',
      description: '',
      icon: 'BookOpen',
      color: 'blue'
    };
    setLocalStructure(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
  };

  const removeNote = (noteId: string) => {
    setLocalStructure(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== noteId)
    }));
  };

  const updateNote = (noteId: string, field: keyof CurriculumStructureNote, value: string) => {
    setLocalStructure(prev => ({
      ...prev,
      notes: prev.notes.map(note => 
        note.id === noteId ? { ...note, [field]: value } : note
      )
    }));
  };

  const saveChanges = () => {
    onUpdateStructure(localStructure);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Curriculum structure saved successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  const resetChanges = () => {
    setLocalStructure({
      ...structure,
      stages: structure.stages.map(s => ({ ...s })),
      notes: structure.notes.map(n => ({ ...n }))
    });
  };

  const hasChanges = () => {
    return JSON.stringify(localStructure) !== JSON.stringify(structure);
  };

  const iconOptions = [
    'BookOpen', 'GraduationCap', 'Target', 'Users', 'User', 'Heart', 
    'Star', 'Award', 'Lightbulb', 'Zap', 'Shield', 'Globe'
  ];

  const colorOptions = [
    'blue', 'teal', 'purple', 'orange', 'green', 'red', 'indigo', 'pink', 'yellow', 'gray'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Curriculum Structure Editor</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={resetChanges}
            disabled={!hasChanges()}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasChanges()}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {hasChanges() && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2">
          <span className="text-yellow-800 text-sm font-medium">You have unsaved changes</span>
        </div>
      )}

      {/* Header Information */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-3">Section Header</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">Title</label>
            <input
              type="text"
              value={localStructure.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
              placeholder="Section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">Subtitle</label>
            <input
              type="text"
              value={localStructure.subtitle}
              onChange={(e) => updateSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Section subtitle"
            />
          </div>
        </div>
      </div>

      {/* Learning Stages Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Learning Stages ({localStructure.stages.length})</h4>
          </div>
          <button
            onClick={addStage}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stage</span>
          </button>
        </div>

        <div className="p-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-3 text-sm font-medium text-gray-700 bg-gray-50 p-2 rounded-md">
            <div className="col-span-2">Stage Name</div>
            <div className="col-span-2">Age Group</div>
            <div className="col-span-3">Weekly Hours</div>
            <div className="col-span-4">Annual Hours</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {localStructure.stages.map((stage, index) => (
              <div key={stage.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="KG1"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={stage.ageGroup}
                    onChange={(e) => updateStage(stage.id, 'ageGroup', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="3-4 years"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={stage.weeklyHours}
                    onChange={(e) => updateStage(stage.id, 'weeklyHours', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="20-22 hours"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={stage.annualHours}
                    onChange={(e) => updateStage(stage.id, 'annualHours', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="720-792 hours"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeStage(stage.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {localStructure.stages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No stages defined.</p>
              <p className="text-sm">Click "Add Stage" to start adding learning stages.</p>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Notes */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="bg-teal-50 px-4 py-3 border-b border-teal-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h4 className="font-medium text-teal-900">Curriculum Notes ({localStructure.notes.length})</h4>
          </div>
          <button
            onClick={addNote}
            className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {localStructure.notes.map((note, index) => (
            <div key={note.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-medium text-gray-900">Note {index + 1}</h5>
                <button
                  onClick={() => removeNote(note.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      placeholder="Note title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <select
                        value={note.icon}
                        onChange={(e) => updateNote(note.id, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <select
                        value={note.color}
                        onChange={(e) => updateNote(note.id, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        {colorOptions.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={note.description}
                    onChange={(e) => updateNote(note.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                    rows={4}
                    placeholder="Detailed description of this curriculum note..."
                  />
                </div>
              </div>
            </div>
          ))}

          {localStructure.notes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No notes defined.</p>
              <p className="text-sm">Click "Add Note" to start adding curriculum notes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Instructions</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Edit the section title and subtitle at the top</li>
          <li>• Add or remove learning stages using the "Add Stage" button and "-" buttons</li>
          <li>• Fill in stage information: name (KG1, KG2, etc.), age group, weekly hours, and annual hours</li>
          <li>• Add curriculum notes to explain different aspects of the program</li>
          <li>• Choose appropriate icons and colors for each note to match the visual design</li>
          <li>• Use the "Save" button to apply your changes permanently</li>
          <li>• Changes will be visible immediately on the home page after saving</li>
        </ul>
      </div>
    </div>
  );
};

export default CurriculumStructureEditor;