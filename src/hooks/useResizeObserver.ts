import { useEffect } from 'react';

/**
 * A hook that observes element resizing and triggers a callback
 * @param ref React ref to the element to observe
 * @param callback Function to call when the element resizes
 */
export const useResizeObserver = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    if (!ref.current) return;

    // Create a new ResizeObserver
    const observer = new ResizeObserver(() => {
      callback();
    });

    // Start observing the element
    observer.observe(ref.current);

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
};
