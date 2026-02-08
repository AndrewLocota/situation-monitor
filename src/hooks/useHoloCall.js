/**
 * useHoloCall - Hook for managing AI character reactions
 * Phase 10: AI Character Reactions
 *
 * Watches for HoloCall state changes and triggers API calls
 * to generate character reactions to news items.
 */

import { useEffect, useRef } from 'react';
import { useDataStore } from '../stores';
import { generateCharacterReaction, mockCharacterReaction } from '../services/api/holoCallService';

// Use mock mode when Supabase is not configured
const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Hook that listens for HoloCall opens and fetches AI reactions
 */
export function useHoloCall() {
  const { holoCall, setHoloCallMessage } = useDataStore();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Only trigger when HoloCall opens and is loading
    if (!holoCall.isOpen || !holoCall.isLoading || !holoCall.newsItem) {
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const fetchReaction = async () => {
      try {
        console.log('[HoloCall] Generating reaction for:', holoCall.characterId);
        const signal = abortControllerRef.current?.signal;

        // Use mock or real API based on configuration
        const result = USE_MOCK
          ? await mockCharacterReaction(holoCall.characterId, holoCall.newsItem)
          : await generateCharacterReaction(holoCall.characterId, holoCall.newsItem, { signal });

        if (result.success) {
          setHoloCallMessage(result.message);
        } else {
          // Use fallback message if available, otherwise show error
          setHoloCallMessage(
            result.message || 'Unable to generate reaction.',
            result.error
          );
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('[HoloCall] Request aborted');
          return;
        }
        console.error('[HoloCall] Error:', error);
        setHoloCallMessage('Connection error. Please try again.', error.message);
      }
    };

    fetchReaction();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [holoCall.isOpen, holoCall.isLoading, holoCall.newsItem, holoCall.characterId, setHoloCallMessage]);
}

export default useHoloCall;
