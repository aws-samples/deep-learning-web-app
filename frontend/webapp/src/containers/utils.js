import { useEffect, useRef } from 'react';

export const displayDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const getNameFromArn = (arn) => {
  if (arn) {
    const i = arn.indexOf('/');
    return arn.substring(i + 1);
  } else {
    return 'N/A'
  }
};

// See https://overreacted.io/making-setinterval-declarative-with-react-hooks/  for details
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
