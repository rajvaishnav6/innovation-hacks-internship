'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAsync(asyncFn, deps = []) {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setStatus('loading');
    setError(null);
    asyncFn()
      .then((result) => {
        setData(result);
        setStatus('success');
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong.');
        setStatus('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { status, data, error, retry: execute };
}
