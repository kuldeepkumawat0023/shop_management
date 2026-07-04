import { useState, useEffect } from 'react';

/**
 * A hook to debounce values (e.g. search inputs) to limit API calls.
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debouncedValue from updating if value is changed within the delay period.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
