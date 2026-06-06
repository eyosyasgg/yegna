import { useState } from 'react';
import { submitCheckin } from '../api/checkins';

export function useCheckin() {
  const [loading, setLoading] = useState(false);

  const checkIn = async (mood, note) => {
    setLoading(true);
    try {
      const res = await submitCheckin({ mood, note });
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return { checkIn, loading };
}
