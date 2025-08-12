import { format, parseISO, isToday, isTomorrow, isYesterday, startOfDay, endOfDay, addDays, subDays, isWithinInterval, differenceInDays, differenceInHours, differenceInMinutes, isAfter, isBefore, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Format date for display in the UI
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format time for display
 * @param {Date|string} date - Date to format
 * @param {boolean} use24Hour - Use 24-hour format (default: false)
 * @returns {string} Formatted time string
 */
export const formatTime = (date, use24Hour = false) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, use24Hour ? 'HH:mm' : 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Get relative date string (Today, Tomorrow, Yesterday, or formatted date)
 * @param {Date|string} date - Date to format
 * @returns {string} Relative date string
 */
export const getRelativeDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (isToday(dateObj)) return 'Today';
    if (isTomorrow(dateObj)) return 'Tomorrow';
    if (isYesterday(dateObj)) return 'Yesterday';
    
    return formatDate(dateObj, 'MMM dd');
  } catch (error) {
    console.error('Error getting relative date:', error);
    return '';
  }
};

/**
 * Get full relative date and time string
 * @param {Date|string} date - Date to format
 * @param {boolean} use24Hour - Use 24-hour format
 * @returns {string} Full relative date and time string
 */
export const getRelativeDateTime = (date, use24Hour = false) => {
  if (!date) return '';
  
  const relativeDate = getRelativeDate(date);
  const time = formatTime(date, use24Hour);
  
  return time ? `${relativeDate} at ${time}` : relativeDate;
};

/**
 * Check if a date is overdue
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isBefore(dateObj, startOfDay(new Date()));
  } catch (error) {
    console.error('Error checking if date is overdue:', error);
    return false;
  }
};

/**
 * Check if a date is due today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is due today
 */
export const isDueToday = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isToday(dateObj);
  } catch (error) {
    console.error('Error checking if date is due today:', error);
    return false;
  }
};

/**
 * Check if a date is due this week
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is due this week
 */
export const isDueThisWeek = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    return isWithinInterval(dateObj, {
      start: startOfWeek(now),
      end: endOfWeek(now)
    });
  } catch (error) {
    console.error('Error checking if date is due this week:', error);
    return false;
  }
};

/**
 * Get days until due date
 * @param {Date|string} date - Due date
 * @returns {number} Number of days until due (negative if overdue)
 */
export const getDaysUntilDue = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(dateObj, startOfDay(new Date()));
  } catch (error) {
    console.error('Error calculating days until due:', error);
    return null;
  }
};

/**
 * Get time remaining until due date
 * @param {Date|string} date - Due date
 * @returns {object} Object with days, hours, and minutes remaining
 */
export const getTimeRemaining = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    
    const totalMinutes = differenceInMinutes(dateObj, now);
    if (totalMinutes < 0) return { overdue: true };
    
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    return { days, hours, minutes, overdue: false };
  } catch (error) {
    console.error('Error calculating time remaining:', error);
    return null;
  }
};

/**
 * Create a date object from date and time strings
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @param {string} timeString - Time string (HH:MM)
 * @returns {Date} Combined date object
 */
export const createDateTime = (dateString, timeString) => {
  if (!dateString) return null;
  
  try {
    if (timeString) {
      return parseISO(`${dateString}T${timeString}:00`);
    }
    return parseISO(`${dateString}T00:00:00`);
  } catch (error) {
    console.error('Error creating date time:', error);
    return null;
  }
};

/**
 * Get date filter ranges
 * @returns {object} Object with various date ranges
 */
export const getDateFilters = () => {
  const now = new Date();
  
  return {
    today: {
      start: startOfDay(now),
      end: endOfDay(now)
    },
    tomorrow: {
      start: startOfDay(addDays(now, 1)),
      end: endOfDay(addDays(now, 1))
    },
    thisWeek: {
      start: startOfWeek(now),
      end: endOfWeek(now)
    },
    thisMonth: {
      start: startOfMonth(now),
      end: endOfMonth(now)
    },
    overdue: {
      start: new Date(0),
      end: startOfDay(now)
    }
  };
};

/**
 * Sort dates in ascending order
 * @param {Array} dates - Array of date objects or strings
 * @returns {Array} Sorted array of dates
 */
export const sortDatesAsc = (dates) => {
  return [...dates].sort((a, b) => {
    const dateA = typeof a === 'string' ? parseISO(a) : a;
    const dateB = typeof b === 'string' ? parseISO(b) : b;
    return dateA - dateB;
  });
};

/**
 * Sort dates in descending order
 * @param {Array} dates - Array of date objects or strings
 * @returns {Array} Sorted array of dates
 */
export const sortDatesDesc = (dates) => {
  return [...dates].sort((a, b) => {
    const dateA = typeof a === 'string' ? parseISO(a) : a;
    const dateB = typeof b === 'string' ? parseISO(b) : b;
    return dateB - dateA;
  });
};