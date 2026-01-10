/**
 * Circuit Breaker Pattern Implementation
 * Prevents excessive API calls to endpoints that are consistently failing
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Endpoint is failing, reject requests immediately
 * - HALF_OPEN: Testing if endpoint has recovered
 */

const STATE = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN'
};

class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.state = STATE.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();

    // Configuration
    this.failureThreshold = options.failureThreshold || 3; // Open after 3 failures
    this.successThreshold = options.successThreshold || 2; // Close after 2 successes in HALF_OPEN
    this.timeout = options.timeout || 60000; // Wait 60s before retry (exponential backoff)
    this.maxTimeout = options.maxTimeout || 600000; // Max 10 minutes
    this.resetTimeout = options.resetTimeout || 300000; // Reset failure count after 5 min of success

    this.lastFailureTime = null;
    this.lastSuccessTime = null;
    this.consecutiveFailures = 0;
  }

  async execute(fn) {
    if (this.state === STATE.OPEN) {
      if (Date.now() < this.nextAttempt) {
        const remainingSeconds = Math.ceil((this.nextAttempt - Date.now()) / 1000);
        if (this.consecutiveFailures <= this.failureThreshold) {
          // Only log first few times to avoid console spam
          console.warn(`[CircuitBreaker:${this.name}] OPEN - Next retry in ${remainingSeconds}s`);
        }
        throw new Error(`Circuit breaker OPEN for ${this.name}`);
      }
      // Transition to HALF_OPEN to test
      this.state = STATE.HALF_OPEN;
      this.successCount = 0;
      console.log(`[CircuitBreaker:${this.name}] Transitioning to HALF_OPEN (testing recovery)`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.lastSuccessTime = Date.now();

    if (this.state === STATE.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = STATE.CLOSED;
        this.failureCount = 0;
        this.consecutiveFailures = 0;
        console.log(`[CircuitBreaker:${this.name}] CLOSED - Endpoint recovered`);
      }
    } else if (this.state === STATE.CLOSED) {
      // Reset failure count after prolonged success
      if (this.failureCount > 0 && Date.now() - this.lastSuccessTime > this.resetTimeout) {
        this.failureCount = 0;
        this.consecutiveFailures = 0;
      }
    }
  }

  onFailure() {
    this.failureCount++;
    this.consecutiveFailures++;
    this.lastFailureTime = Date.now();

    if (this.state === STATE.HALF_OPEN) {
      // Failed during testing, go back to OPEN
      this.state = STATE.OPEN;
      this.calculateNextAttempt();
      console.warn(`[CircuitBreaker:${this.name}] Back to OPEN - Endpoint still failing`);
    } else if (this.failureCount >= this.failureThreshold) {
      // Too many failures, open the circuit
      this.state = STATE.OPEN;
      this.calculateNextAttempt();
      console.warn(`[CircuitBreaker:${this.name}] OPENED - ${this.failureCount} failures detected`);
    }
  }

  calculateNextAttempt() {
    // Exponential backoff: 1min, 2min, 4min, 8min, capped at maxTimeout
    const exponentialDelay = Math.min(
      this.timeout * Math.pow(2, Math.min(this.consecutiveFailures - this.failureThreshold, 4)),
      this.maxTimeout
    );
    this.nextAttempt = Date.now() + exponentialDelay;
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      consecutiveFailures: this.consecutiveFailures,
      nextAttempt: this.nextAttempt,
      lastFailure: this.lastFailureTime,
      lastSuccess: this.lastSuccessTime
    };
  }

  reset() {
    this.state = STATE.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.consecutiveFailures = 0;
    this.nextAttempt = Date.now();
    console.log(`[CircuitBreaker:${this.name}] Manually reset`);
  }
}

// Global circuit breaker registry
const breakers = new Map();

export function getCircuitBreaker(name, options) {
  if (!breakers.has(name)) {
    breakers.set(name, new CircuitBreaker(name, options));
  }
  return breakers.get(name);
}

export function resetCircuitBreaker(name) {
  const breaker = breakers.get(name);
  if (breaker) {
    breaker.reset();
  }
}

export function resetAllCircuitBreakers() {
  breakers.forEach(breaker => breaker.reset());
  console.log('[CircuitBreaker] All breakers reset');
}

export function getCircuitBreakerStats() {
  const stats = [];
  breakers.forEach(breaker => {
    stats.push(breaker.getState());
  });
  return stats;
}

// Utility: Wrap fetch calls with circuit breaker
export async function fetchWithCircuitBreaker(name, fetchFn, options = {}) {
  const breaker = getCircuitBreaker(name, options);
  return breaker.execute(fetchFn);
}
