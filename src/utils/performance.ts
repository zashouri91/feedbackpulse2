import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private readonly threshold = 1000; // 1 second

  startMetric(name: string, metadata?: Record<string, any>) {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  endMetric(name: string) {
    const metric = this.metrics.get(name);
    if (!metric) return;

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    if (metric.duration > this.threshold) {
      logger.warn(
        `Performance threshold exceeded: ${name} took ${metric.duration.toFixed(2)}ms`,
        'Performance',
        { metric }
      );
    }

    return metric;
  }

  getMetric(name: string) {
    return this.metrics.get(name);
  }

  getAllMetrics() {
    return Array.from(this.metrics.values());
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const performance = new PerformanceMonitor();

// Performance monitoring decorator
export function monitor(context?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const metricName = `${context || target.constructor.name}.${propertyKey}`;
      performance.startMetric(metricName);

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } finally {
        performance.endMetric(metricName);
      }
    };

    return descriptor;
  };
}
