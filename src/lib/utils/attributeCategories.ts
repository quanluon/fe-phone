/**
 * Utility functions for handling attribute categories
 */

// Attribute category mapping from admin constants to frontend i18n keys
export const ATTRIBUTE_CATEGORY_MAPPING = {
  'display': 'display',
  'performance': 'performance', 
  'camera': 'camera',
  'storage': 'storage',
  'battery': 'battery',
  'connectivity': 'connectivity',
  'design': 'design',
  'audio': 'audio',
  'sensors': 'sensors',
  'software': 'software',
  'accessories': 'accessories',
  'warranty': 'warranty',
} as const;

/**
 * Get the i18n key for an attribute category
 * @param category - The category from the database
 * @returns The i18n key for translation
 */
export const getAttributeCategoryKey = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  
  // Check if it's a known category
  if (normalizedCategory in ATTRIBUTE_CATEGORY_MAPPING) {
    return ATTRIBUTE_CATEGORY_MAPPING[normalizedCategory as keyof typeof ATTRIBUTE_CATEGORY_MAPPING];
  }
  
  // Return 'other' for unknown categories
  return 'other';
};

/**
 * Validate if a category is supported
 * @param category - The category to validate
 * @returns True if the category is supported
 */
export const isSupportedAttributeCategory = (category: string): boolean => {
  const normalizedCategory = category.toLowerCase();
  return normalizedCategory in ATTRIBUTE_CATEGORY_MAPPING;
};

/**
 * Get all supported attribute categories
 * @returns Array of supported category keys
 */
export const getSupportedAttributeCategories = (): string[] => {
  return Object.values(ATTRIBUTE_CATEGORY_MAPPING);
};
