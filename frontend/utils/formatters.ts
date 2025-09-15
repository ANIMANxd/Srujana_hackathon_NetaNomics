/**
 * Formats a number as Indian Rupee currency.
 * @param amount The number to format.
 * @returns A formatted currency string (e.g., "₹58,88,001").
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};