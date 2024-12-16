type RateLimit = {
  count: number;
  resetAt: number;
};

class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  private readonly window = 60 * 1000; // 1 minute
  private readonly maxRequests = 100;

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit || now >= limit.resetAt) {
      this.limits.set(key, {
        count: 1,
        resetAt: now + this.window,
      });
      return false;
    }

    if (limit.count >= this.maxRequests) {
      return true;
    }

    limit.count++;
    return false;
  }

  getRemainingRequests(key: string): number {
    const limit = this.limits.get(key);
    if (!limit || Date.now() >= limit.resetAt) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - limit.count);
  }

  clear(): void {
    this.limits.clear();
  }
}

export const rateLimiter = new RateLimiter();
