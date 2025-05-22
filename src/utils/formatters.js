import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  // Ensure date is a Date object, if it's a string, parse it as ISO
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd MMM, hh:mm a');
};

export const formatShortDate = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd MMM');
};

export const formatDateTimeForDisplay = (dateString) => {
  try {
    // parseISO correctly handles ISO strings, then format uses local timezone
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, hh:mm a');
  } catch (e) {
    console.error('Error formatting date for display:', e);
    return dateString;
  }
};

// Add this new formatter for transaction lists (same as formatDateTimeForDisplay for consistency)
export const formatTransactionDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, hh:mm a');
  } catch (e) {
    console.error('Error formatting transaction date:', e);
    return dateString;
  }
};