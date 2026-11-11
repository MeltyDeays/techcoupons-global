// Fast, Deterministic Fetch Mock for AI Radar testing
export function installMockFetch(handlerOrResponse = null) {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    if (typeof handlerOrResponse === 'function') {
      return handlerOrResponse(url, options);
    }
    if (handlerOrResponse) {
      return handlerOrResponse;
    }
    // Default fast offline / 503 simulation for instantaneous fallback testing
    return {
      ok: false,
      status: 503,
      json: async () => ({ error: 'Gateway unavailable' })
    };
  };

  return () => {
    globalThis.fetch = originalFetch;
  };
}
