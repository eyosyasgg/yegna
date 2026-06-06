import { useState, useEffect, useCallback } from 'react';
import { getMatch } from '../api/match';

export function useMatch() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    getMatch()
      .then(res => setMatch(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { refetch(); }, [refetch]);

  return { match, loading, refetch };
}
