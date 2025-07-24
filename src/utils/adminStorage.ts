import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PricingConfig, CurriculumLevel, CurriculumStructureConfig } from '../types';

// Use localStorage for admin settings since we're using passcode auth
const STORAGE_KEYS = {
  PRICING: 'kodeit_admin_pricing',
  CURRICULUM: 'kodeit_admin_curriculum',
  CURRICULUM_STRUCTURE: 'kodeit_admin_curriculum_structure'
};

// Storage functions with localStorage fallback
export const savePricingToServer = async (pricing: PricingConfig): Promise<void> => {
  console.log('Saving pricing to server:', pricing);
  
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
    console.log('Pricing saved to localStorage');
    return;
  }

  try {
    const { error } = await supabase!
      .from('admin_settings')
      .upsert({
        id: 'pricing_config',
        setting_type: 'pricing',
        setting_value: pricing,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
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
  
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRICING);
      const result = stored ? JSON.parse(stored) : null;
      console.log('Pricing loaded from localStorage:', result);
      return result;
    } catch {
      return null;
    }
  }

  try {
    const { data, error } = await supabase!
      .from('admin_settings')
      .select('setting_value')
      .eq('id', 'pricing_config')
      .eq('setting_type', 'pricing')
      .maybeSingle();

    if (error) throw error;
    
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
  
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
    console.log('Curriculum saved to localStorage');
    return;
  }

  try {
    const { error } = await supabase!
      .from('admin_settings')
      .upsert({
        id: 'curriculum_config',
        setting_type: 'curriculum',
        setting_value: curriculum,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
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
  
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
      const result = stored ? JSON.parse(stored) : null;
      console.log('Curriculum loaded from localStorage:', result);
      return result;
    } catch {
      return null;
    }
  }

  try {
    const { data, error } = await supabase!
      .from('admin_settings')
      .select('setting_value')
      .eq('id', 'curriculum_config')
      .eq('setting_type', 'curriculum')
      .maybeSingle();

    if (error) throw error;
    
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
  
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.CURRICULUM_STRUCTURE, JSON.stringify(structure));
    console.log('Curriculum structure saved to localStorage');
    return;
  }

  try {
    const { error } = await supabase!
      .from('admin_settings')
      .upsert({
        id: 'curriculum_structure_config',
        setting_type: 'curriculum_structure',
        setting_value: structure,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
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
  
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRICULUM_STRUCTURE);
      const result = stored ? JSON.parse(stored) : null;
      console.log('Curriculum structure loaded from localStorage:', result);
      return result;
    } catch {
      return null;
    }
  }

  try {
    const { data, error } = await supabase!
      .from('admin_settings')
      .select('setting_value')
      .eq('id', 'curriculum_structure_config')
      .eq('setting_type', 'curriculum_structure')
      .maybeSingle();

    if (error) throw error;
    
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
  
  if (!isSupabaseConfigured()) {
    console.log('Data cleared from localStorage');
    return;
  }

  try {
    // Clear Supabase data
    await supabase!
      .from('admin_settings')
      .delete()
      .in('id', ['pricing_config', 'curriculum_config', 'curriculum_structure_config']);
    
    console.log('Data cleared from server');
  } catch (error) {
    console.error('Failed to clear server data:', error);
    // Don't throw error, localStorage is already cleared
  }
};

// Real-time subscription for admin settings changes (simplified for passcode auth)
export const subscribeToAdminChanges = (
  onPricingChange: (pricing: PricingConfig) => void,
  onCurriculumChange: (curriculum: CurriculumLevel[]) => void,
  onCurriculumStructureChange?: (structure: CurriculumStructureConfig) => void
) => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured or using passcode auth, real-time updates disabled');
    return null;
  }

  const subscription = supabase!
    .channel('admin_settings_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'admin_settings'
      },
      (payload) => {
        console.log('Admin settings changed:', payload);
        
        if (payload.new && typeof payload.new === 'object') {
          const { setting_type, setting_value } = payload.new as any;
          
          if (setting_type === 'pricing') {
            onPricingChange(setting_value);
          } else if (setting_type === 'curriculum') {
            onCurriculumChange(setting_value);
          } else if (setting_type === 'curriculum_structure' && onCurriculumStructureChange) {
            onCurriculumStructureChange(setting_value);
          }
        }
      }
    )
    .subscribe();

  return subscription;
};