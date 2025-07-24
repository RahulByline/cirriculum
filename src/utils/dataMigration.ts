import { PricingConfig, CurriculumLevel, CurriculumStructureConfig } from '../types';

// Data migration utility to move data from localStorage to backend
export const exportLocalStorageData = () => {
  const data = {
    pricing: localStorage.getItem('kodeit_admin_pricing'),
    curriculum: localStorage.getItem('kodeit_admin_curriculum'),
    curriculumStructure: localStorage.getItem('kodeit_admin_curriculum_structure')
  };

  console.log('=== LOCALSTORAGE DATA EXPORT ===');
  console.log('Pricing:', data.pricing);
  console.log('Curriculum:', data.curriculum);
  console.log('Curriculum Structure:', data.curriculumStructure);
  
  return {
    pricing: data.pricing ? JSON.parse(data.pricing) : null,
    curriculum: data.curriculum ? JSON.parse(data.curriculum) : null,
    curriculumStructure: data.curriculumStructure ? JSON.parse(data.curriculumStructure) : null
  };
};

// Function to migrate data from localStorage to backend
export const migrateDataToBackend = async () => {
  const localData = exportLocalStorageData();
  
  console.log('=== STARTING DATA MIGRATION ===');
  
  try {
    // Import the storage functions
    const { savePricingToServer, saveCurriculumToServer, saveCurriculumStructureToServer } = 
      await import('./adminStorage');
    
    // Migrate pricing data
    if (localData.pricing) {
      console.log('Migrating pricing data...');
      await savePricingToServer(localData.pricing);
      console.log('✅ Pricing data migrated');
    }
    
    // Migrate curriculum data
    if (localData.curriculum) {
      console.log('Migrating curriculum data...');
      await saveCurriculumToServer(localData.curriculum);
      console.log('✅ Curriculum data migrated');
    }
    
    // Migrate curriculum structure data
    if (localData.curriculumStructure) {
      console.log('Migrating curriculum structure data...');
      await saveCurriculumStructureToServer(localData.curriculumStructure);
      console.log('✅ Curriculum structure data migrated');
    }
    
    console.log('🎉 DATA MIGRATION COMPLETED SUCCESSFULLY!');
    return true;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
};

// Function to clear localStorage after successful migration
export const clearLocalStorageAfterMigration = () => {
  localStorage.removeItem('kodeit_admin_pricing');
  localStorage.removeItem('kodeit_admin_curriculum');
  localStorage.removeItem('kodeit_admin_curriculum_structure');
  console.log('🧹 localStorage cleared after migration');
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).exportLocalStorageData = exportLocalStorageData;
  (window as any).migrateDataToBackend = migrateDataToBackend;
  (window as any).clearLocalStorageAfterMigration = clearLocalStorageAfterMigration;
}
