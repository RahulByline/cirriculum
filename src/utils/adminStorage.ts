import { PricingConfig, CurriculumLevel, CurriculumStructureConfig } from '../types';

// Backend API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Use localStorage for fallback
const STORAGE_KEYS = {
  PRICING: 'kodeit_admin_pricing',
  CURRICULUM: 'kodeit_admin_curriculum',
  CURRICULUM_STRUCTURE: 'kodeit_admin_curriculum_structure'
};

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Storage functions with localStorage fallback
export const savePricingToServer = async (pricing: PricingConfig): Promise<void> => {
  console.log('Saving pricing to server:', pricing);
  
  try {
    await apiCall('/admin_settings/pricing_config', {
      method: 'PUT',
      body: JSON.stringify({
        setting_value: pricing
      })
    });
    console.log('Pricing saved to server successfully');
  } catch (error) {
    console.error('Failed to save pricing to server:', error);
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
    console.log('Pricing saved to localStorage as fallback');
  }
};

export const loadPricingFromServer = async (): Promise<PricingConfig | null> => {
  console.log('Loading pricing from server...');
  
  try {
    const data = await apiCall('/admin_settings/pricing_config');
    const result = data?.setting_value || null;
    console.log('Pricing loaded from server:', result);
    return result;
  } catch (error) {
    console.error('Failed to load pricing from server:', error);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRICING);
      const result = stored ? JSON.parse(stored) : null;
      console.log('Pricing loaded from localStorage as fallback:', result);
      return result;
    } catch {
      return null;
    }
  }
};

export const saveCurriculumToServer = async (curriculum: CurriculumLevel[]): Promise<void> => {
  console.log('Saving curriculum to server:', curriculum);
  
  try {
    await apiCall('/admin_settings/curriculum_config', {
      method: 'PUT',
      body: JSON.stringify({
        setting_value: curriculum
      })
    });
    console.log('Curriculum saved to server successfully');
  } catch (error) {
    console.error('Failed to save curriculum to server:', error);
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
    console.log('Curriculum saved to localStorage as fallback');
  }
};

export const loadCurriculumFromServer = async (): Promise<CurriculumLevel[] | null> => {
  console.log('Loading curriculum from server...');
  
  try {
    const data = await apiCall('/admin_settings/curriculum_config');
    const result = data?.setting_value || null;
    console.log('Curriculum loaded from server:', result);
    return result;
  } catch (error) {
    console.error('Failed to load curriculum from server:', error);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
      const result = stored ? JSON.parse(stored) : null;
      console.log('Curriculum loaded from localStorage as fallback:', result);
      return result;
    } catch {
      return null;
    }
  }
};

export const saveCurriculumStructureToServer = async (structure: CurriculumStructureConfig): Promise<void> => {
  console.log('Saving curriculum structure to server:', structure);
  
  try {
    await apiCall('/admin_settings/curriculum_structure_config', {
      method: 'PUT',
      body: JSON.stringify({
        setting_value: structure
      })
    });
    console.log('Curriculum structure saved to server successfully');
  } catch (error) {
    console.error('Failed to save curriculum structure to server:', error);
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.CURRICULUM_STRUCTURE, JSON.stringify(structure));
    console.log('Curriculum structure saved to localStorage as fallback');
  }
};

export const loadCurriculumStructureFromServer = async (): Promise<CurriculumStructureConfig | null> => {
  console.log('Loading curriculum structure from server...');
  
  try {
    const data = await apiCall('/admin_settings/curriculum_structure_config');
    const result = data?.setting_value || null;
    console.log('Curriculum structure loaded from server:', result);
    return result;
  } catch (error) {
    console.error('Failed to load curriculum structure from server:', error);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRICULUM_STRUCTURE);
      const result = stored ? JSON.parse(stored) : null;
      console.log('Curriculum structure loaded from localStorage as fallback:', result);
      return result;
    } catch {
      return null;
    }
  }
};

// Function to clear all stored data
export const clearAllStoredData = async (): Promise<void> => {
  console.log('Clearing all stored data...');
  
  // Clear localStorage
  localStorage.removeItem(STORAGE_KEYS.PRICING);
  localStorage.removeItem(STORAGE_KEYS.CURRICULUM);
  localStorage.removeItem(STORAGE_KEYS.CURRICULUM_STRUCTURE);
  
  try {
    // Clear backend data
    await apiCall('/admin_settings/pricing_config', { method: 'DELETE' });
    await apiCall('/admin_settings/curriculum_config', { method: 'DELETE' });
    await apiCall('/admin_settings/curriculum_structure_config', { method: 'DELETE' });
    
    console.log('Data cleared from server');
  } catch (error) {
    console.error('Failed to clear server data:', error);
    // Don't throw error, localStorage is already cleared
  }
};

// Real-time subscription for admin settings changes (disabled for backend implementation)
export const subscribeToAdminChanges = (
  onPricingChange: (pricing: PricingConfig) => void,
  onCurriculumChange: (curriculum: CurriculumLevel[]) => void,
  onCurriculumStructureChange?: (structure: CurriculumStructureConfig) => void
) => {
  console.log('Real-time updates not implemented for backend API');
  return null;
};