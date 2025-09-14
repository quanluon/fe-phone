/**
 * Format translation message with parameters
 * @param message - The message template with {param} placeholders
 * @param params - Object with parameter values
 * @returns Formatted message string
 */
export function formatMessage(message: string, params: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

/**
 * Get cart validation message based on error type
 * @param errorType - The type of validation error
 * @param params - Parameters for message formatting
 * @param t - Translation function
 * @returns Formatted error message
 */
export function getCartValidationMessage(
  errorType: 'insufficient_stock' | 'out_of_stock' | 'invalid_quantity',
  params: Record<string, string | number>,
  t: (key: string) => string
): string {
  const messages = {
    insufficient_stock: t('cart.validation.insufficientStock'),
    out_of_stock: t('cart.validation.outOfStock'),
    invalid_quantity: t('cart.validation.quantityMustBeGreaterThanZero'),
  };

  return formatMessage(messages[errorType], params);
}
