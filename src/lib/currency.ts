/**
 * Currency formatting utilities for Kenyan Shillings (KES)
 */

export const formatKES = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'KSh 0.00';
  }
  
  return `KSh ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const parseKES = (value: string): number => {
  // Remove currency symbol and parse as number
  const cleanValue = value.replace(/[KSh,\s]/g, '');
  return parseFloat(cleanValue) || 0;
};

export const validateKES = (value: string): boolean => {
  const parsed = parseKES(value);
  return !isNaN(parsed) && parsed >= 0;
};