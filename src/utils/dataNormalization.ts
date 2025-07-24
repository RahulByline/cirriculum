import { CurriculumLevel, Book, Unit, Lesson } from '../types';

export const normalizeLesson = (lesson: any, index: number): Lesson => {
  // Handle both old string format and new object format
  if (typeof lesson === 'string') {
    return {
      id: `lesson_${index}_${Date.now()}`,
      name: lesson,
      objective: `Learn about ${lesson.toLowerCase()}`
    };
  }
  
  return {
    id: lesson.id || `lesson_${index}_${Date.now()}`,
    name: lesson.name || '',
    objective: lesson.objective || ''
  };
};

export const normalizeUnit = (unit: any): Unit => {
  return {
    id: unit.id || '',
    name: unit.name || '',
    lessons: Array.isArray(unit.lessons) ? unit.lessons.map(normalizeLesson) : []
  };
};

export const normalizeBook = (book: any): Book => {
  // Handle old format where units and lessons were arrays of strings
  let normalizedUnits: Unit[] = [];
  
  if (Array.isArray(book.units)) {
    if (book.units.length > 0 && typeof book.units[0] === 'string') {
      // Old format: units are strings, lessons are strings
      const unitsArray = book.units as string[];
      const lessonsArray = (book.lessons || []) as string[];
      
      // Distribute lessons across units
      const lessonsPerUnit = Math.ceil(lessonsArray.length / unitsArray.length);
      
      normalizedUnits = unitsArray.map((unitName, unitIndex) => {
        const startIndex = unitIndex * lessonsPerUnit;
        const endIndex = Math.min(startIndex + lessonsPerUnit, lessonsArray.length);
        const unitLessons = lessonsArray.slice(startIndex, endIndex);
        
        return {
          id: `unit_${unitIndex}_${Date.now()}`,
          name: unitName,
          lessons: unitLessons.map((lessonName, lessonIndex) => ({
            id: `lesson_${unitIndex}_${lessonIndex}_${Date.now()}`,
            name: lessonName,
            objective: `Learn about ${lessonName.toLowerCase()}`
          }))
        };
      });
    } else {
      // New format: units are objects
      normalizedUnits = book.units.map(normalizeUnit);
    }
  }
  
  return {
    id: book.id || '',
    name: book.name || '',
    description: book.description || '',
    units: normalizedUnits,
    isPracticeBook: Boolean(book.isPracticeBook),
    isTeacherGuide: Boolean(book.isTeacherGuide),
    hyperlink: book.hyperlink || '',
    isbn: book.isbn || ''
  };
};

export const normalizeCurriculumLevel = (level: any): CurriculumLevel => {
  return {
    id: level.id || '',
    name: level.name || '',
    books: Array.isArray(level.books) ? level.books.map(normalizeBook) : []
  };
};

export const normalizeCurriculum = (curriculum: any): CurriculumLevel[] => {
  if (!Array.isArray(curriculum)) {
    return [];
  }
  
  return curriculum.map(normalizeCurriculumLevel);
};