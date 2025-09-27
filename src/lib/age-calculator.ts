import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export function calculateAge(dateOfBirth: Date | string | null, fallbackDate?: Date | string | null): string {
  let birthDate: Date | null = null;
  
  // Try to use the primary date of birth first
  if (dateOfBirth) {
    birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  }
  
  // If no DOB, use fallback date (date of birth on farm)
  if (!birthDate && fallbackDate) {
    birthDate = typeof fallbackDate === 'string' ? new Date(fallbackDate) : fallbackDate;
  }
  
  if (!birthDate || isNaN(birthDate.getTime())) {
    return 'Unknown';
  }
  
  const today = new Date();
  
  // If the birth date is in the future, return unknown
  if (birthDate > today) {
    return 'Unknown';
  }
  
  const years = differenceInYears(today, birthDate);
  const months = differenceInMonths(today, birthDate) % 12;
  const days = differenceInDays(today, birthDate);
  
  // If less than a month old, show days
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  
  // If less than a year old, show months
  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  
  // Show years and months
  if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  
  return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
}