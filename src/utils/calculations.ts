import { SelectedItem, CostBreakdownItem, FormatType, BrandingType, PricingConfig, CurriculumLevel } from '../types';

export const calculateCosts = (
  selectedBooks: SelectedItem[],
  selectedGuides: SelectedItem[],
  format: FormatType,
  branding: BrandingType,
  pricing: PricingConfig,
  curriculum: CurriculumLevel[]
): { items: CostBreakdownItem[]; total: number } => {
  console.log('calculateCosts called with pricing:', pricing);
  console.log('selectedBooks:', selectedBooks);
  console.log('selectedGuides:', selectedGuides);
  
  const items: CostBreakdownItem[] = [];
  let subtotal = 0;

  // Helper function to get book name from curriculum
  const getBookName = (bookId: string): string => {
    for (const level of curriculum) {
      const book = level.books.find(b => b.id === bookId);
      if (book) return book.name;
    }
    return bookId; // fallback to ID if not found
  };

  // Calculate student book costs
  selectedBooks.forEach(item => {
    // Check if this is a practice book
    const book = curriculum.find(level => 
      level.books.some(b => b.id === item.bookId)
    )?.books.find(b => b.id === item.bookId);
    
    const unitPrice = book?.isPracticeBook 
      ? pricing.practiceBook[format]
      : pricing.studentBook[format];
    
    console.log(`Book ${item.bookId}: isPractice=${book?.isPracticeBook}, format=${format}, unitPrice=${unitPrice}`);
    
    const itemSubtotal = item.quantity * unitPrice;
    const bookName = getBookName(item.bookId);
    const bookType = book?.isPracticeBook ? 'Practice Book' : 'Student Book';
    
    items.push({
      name: `${bookType} - ${bookName}`,
      type: 'book',
      quantity: item.quantity,
      unitPrice,
      subtotal: itemSubtotal,
      bookId: item.bookId
    });
    subtotal += itemSubtotal;
  });

  // Calculate teacher guide costs
  selectedGuides.forEach(item => {
    // Find the actual book to check if it's a teacher guide
    const book = curriculum.find(level => 
      level.books.some(b => b.id === item.bookId)
    )?.books.find(b => b.id === item.bookId);
    
    // Only process if this is actually a teacher guide book
    if (!book?.isTeacherGuide) {
      console.log(`Skipping ${item.bookId} - not a teacher guide book`);
      return;
    }
    
    const unitPrice = pricing.teacherGuide[format];
    console.log(`Teacher Guide ${item.bookId}: format=${format}, unitPrice=${unitPrice}`);
    
    const itemSubtotal = item.quantity * unitPrice;
    const bookName = getBookName(item.bookId);
    items.push({
      name: bookName, // Teacher guide books already have "Teacher Guide" in their name
      type: 'guide',
      quantity: item.quantity,
      unitPrice,
      subtotal: itemSubtotal,
      bookId: item.bookId
    });
    subtotal += itemSubtotal;
  });

  // Calculate branding costs
  const brandingMultiplier = pricing.branding[branding];
  console.log(`Branding: ${branding}, multiplier=${brandingMultiplier}`);
  
  const brandingCost = subtotal * (brandingMultiplier - 1);
  
  if (brandingCost > 0) {
    const brandingName = branding === 'cobranded' ? 'Co-branded' : 'White-labeled';
    items.push({
      name: brandingName,
      type: 'branding',
      quantity: 1,
      unitPrice: brandingCost,
      subtotal: brandingCost
    });
  }

  const total = subtotal * brandingMultiplier;
  console.log(`Final calculation: subtotal=${subtotal}, total=${total}`);

  return { items, total };
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
    AUD: 'A$', AED: 'د.إ', JPY: '¥', INR: '₹'
  };
  
  const symbol = currencySymbols[currency] || currency;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  }).format(amount);
};

export const convertCurrency = (amount: number, exchangeRate: number): number => {
  return amount * exchangeRate;
};

// Mock exchange rates - in production, these would come from an API
export const getExchangeRates = (): Record<string, number> => {
  return {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    CAD: 1.25,
    AUD: 1.35,
    AED: 3.67,
    JPY: 110.0,
    INR: 74.5
  };
};