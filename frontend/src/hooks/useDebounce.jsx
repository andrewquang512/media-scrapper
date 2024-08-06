import { useRef } from 'react';

export const useDebounce = (func, delay) => {
  const debounceTimeout = useRef(null);

  return function (...args) {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      func(...args);
      debounceTimeout.current = null;
    }, delay);
  };
};
