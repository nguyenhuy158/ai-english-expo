import { useEffect, useState } from 'react';
import { isUnauthorized } from './api';

/**
 * Gọi một endpoint, trả về {data, error, loading}.
 * 401 được chuyển lên onUnauthorized để App đưa về màn đăng nhập.
 */
export function useApi(fetcher, deps, onUnauthorized) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let alive = true;
    setState({ data: null, error: null, loading: true });
    fetcher()
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((err) => {
        if (!alive) return;
        if (isUnauthorized(err)) return onUnauthorized?.();
        setState({ data: null, error: err.message, loading: false });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
