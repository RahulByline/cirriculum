import { CurriculumLevel, CurriculumStructureConfig, PricingConfig } from '../types';

export const curriculumData: CurriculumLevel[] = [
  {
    id: "level1",
    name: "Level 1 (Ages 3-4)",
    books: []
  },
  {
    id: "level2",
    name: "Level 2 (Ages 4-5)",
    books: []
  },
  {
    id: "level3",
    name: "Level 3 (Ages 5-6)",
    books: []
  }
];

export const curriculumStructure: CurriculumStructureConfig = {
  title: "Pre-K Curriculum Structure",
  subtitle: "Comprehensive learning framework for early childhood development",
  stages: [
    {
      id: "kg1",
      name: "KG1",
      ageGroup: "3-4 years",
      weeklyHours: "20-22 hours",
      annualHours: "720-792 hours"
    },
    {
      id: "kg2",
      name: "KG2", 
      ageGroup: "4-5 years",
      weeklyHours: "22-25 hours",
      annualHours: "792-900 hours"
    },
    {
      id: "prep",
      name: "Prep",
      ageGroup: "5-6 years", 
      weeklyHours: "25-30 hours",
      annualHours: "900-1080 hours"
    }
  ],
  notes: [
    {
      id: "note1",
      title: "Play-Based Learning",
      description: "Our curriculum emphasizes learning through play, ensuring children develop naturally while having fun. Play-based activities promote creativity, social skills, and cognitive development.",
      icon: "BookOpen",
      color: "blue"
    },
    {
      id: "note2", 
      title: "Individual Development",
      description: "Each child progresses at their own pace. Our flexible curriculum accommodates different learning styles and developmental stages, ensuring every child succeeds.",
      icon: "Target",
      color: "teal"
    },
    {
      id: "note3",
      title: "Holistic Approach",
      description: "We focus on the whole child - cognitive, social, emotional, and physical development. Our integrated approach ensures balanced growth across all domains.",
      icon: "Users",
      color: "purple"
    },
    {
      id: "note4",
      title: "Family Partnership",
      description: "Strong family-school partnerships enhance learning outcomes. We encourage family involvement and provide resources for continued learning at home.",
      icon: "GraduationCap",
      color: "orange"
    }
  ]
};

export const pricing: PricingConfig = {
  studentBook: {
    digital: 80,
    print: 100,
    both: 180
  },
  practiceBook: {
    digital: 60,
    print: 80,
    both: 140
  },
  teacherGuide: {
    digital: 500,
    print: 500,
    both: 1000
  },
  branding: {
    kodeit: 1.0,
    cobranded: 1.1,
    whitelabeled: 1.25
  }
};