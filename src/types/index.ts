export interface Lesson {
  id: string;
  name: string;
  objective: string;
}

export interface Unit {
  id: string;
  name: string;
  lessons: Lesson[];
}

export interface CurriculumLevel {
  id: string;
  name: string;
  books: Book[];
}

export interface Book {
  id: string;
  name: string;
  description: string;
  units: Unit[];
  isPracticeBook?: boolean;
  isTeacherGuide?: boolean;
  hyperlink?: string;
  isbn?: string;
}

export interface SelectedItem {
  type: 'book' | 'guide';
  bookId: string;
  levelId: string;
  quantity: number;
}

export interface PricingConfig {
  studentBook: {
    digital: number;
    print: number;
    both: number;
  };
  practiceBook: {
    digital: number;
    print: number;
    both: number;
  };
  teacherGuide: {
    digital: number;
    print: number;
    both: number;
  };
  branding: {
    kodeit: number;
    cobranded: number;
    whitelabeled: number;
  };
}

export interface CostBreakdownItem {
  name: string;
  type: 'book' | 'guide' | 'branding';
  quantity: number;
  unitPrice: number;
  subtotal: number;
  bookId?: string;
}
export type FormatType = 'digital' | 'print' | 'both';
export type BrandingType = 'kodeit' | 'cobranded' | 'whitelabeled';
export interface CurriculumStructureStage {
  id: string;
  name: string;
  ageGroup: string;
  weeklyHours: string;
  annualHours: string;
}

export interface CurriculumStructureNote {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface CurriculumStructureConfig {
  title: string;
  subtitle: string;
  stages: CurriculumStructureStage[];
  notes: CurriculumStructureNote[];
}