/**
 * HoloCall Service - Supabase Edge Function Integration
 * Phase 10: AI Character Reactions
 *
 * Calls Supabase Edge Function which securely calls Gemini API
 * API keys are stored in Supabase secrets, not exposed to frontend
 */

import { buildCharacterPrompt, getCharacter } from '../../data/characters';

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Edge function endpoint
const HOLOCALL_FUNCTION = 'holocall-reaction';

/**
 * Generate character reaction to news item via Supabase Edge Function
 *
 * @param {string} characterId - ID of the character (e.g., 'trump')
 * @param {Object} newsItem - News item to react to
 * @param {Object} options - Additional options
 * @param {AbortSignal} options.signal - AbortController signal for cancellation
 * @returns {Promise<{success: boolean, message: string, error?: string}>}
 */
export async function generateCharacterReaction(characterId, newsItem, options = {}) {
  const character = getCharacter(characterId);

  if (!character) {
    return {
      success: false,
      message: '',
      error: `Unknown character: ${characterId}`
    };
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[HoloCall] Supabase not configured, using fallback');
    return {
      success: false,
      message: getFallbackReaction(character, newsItem),
      error: 'Supabase not configured',
      isFallback: true
    };
  }

  // Build the prompt
  const prompt = buildCharacterPrompt(character, newsItem);
  const { signal } = options;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/${HOLOCALL_FUNCTION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          characterId,
          characterName: character.name,
          prompt,
          newsTitle: newsItem?.title || '',
          newsSource: newsItem?.source || '',
        }),
        signal
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: data.message || '',
      characterId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    if (error?.name === 'AbortError') {
      throw error;
    }

    console.error('[HoloCall] Error generating reaction:', error);

    return {
      success: false,
      message: getFallbackReaction(character, newsItem),
      error: error.message,
      isFallback: true
    };
  }
}

/**
 * Generate fallback reaction when API fails
 */
function getFallbackReaction(character, newsItem) {
  const fallbacks = {
    trump: [
      "Fake news! But we'll see what happens.",
      "Many people are talking about this. Not good!",
      "I've been saying this for years. Nobody listens!",
      "This is a disaster. Total disaster.",
      "We're going to look into this very strongly.",
      "Nobody knows more about this than me. Believe me.",
      "The fake news media won't report the truth!"
    ],
    putin: [
      "The West creates problems, then blames others.",
      "This is expected given Western provocations.",
      "We will respond appropriately.",
      "Interesting. We are monitoring the situation.",
      "Russia's position remains unchanged."
    ],
    zelensky: [
      "Ukraine stands ready. We need support now.",
      "Every day matters in this fight.",
      "The world must act. Freedom is at stake.",
      "We will not surrender. Never.",
      "Democracy must be defended."
    ]
  };

  const characterFallbacks = fallbacks[character.id] || [
    "No comment at this time.",
    "We are aware of the situation.",
    "Interesting development."
  ];

  const randomIndex = Math.floor(Math.random() * characterFallbacks.length);
  return characterFallbacks[randomIndex];
}

/**
 * Check if the HoloCall service is available
 */
export async function checkHoloCallHealth() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/${HOLOCALL_FUNCTION}`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Mock function for testing without API
 */
export async function mockCharacterReaction(characterId, newsItem) {
  const character = getCharacter(characterId);

  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  return {
    success: true,
    message: getFallbackReaction(character, newsItem),
    characterId,
    timestamp: new Date().toISOString(),
    isMock: true
  };
}

export default {
  generateCharacterReaction,
  checkHoloCallHealth,
  mockCharacterReaction
};
