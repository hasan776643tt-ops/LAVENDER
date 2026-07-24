class AnalyticsService {
  constructor() {
    this.events = [];
  }

  track(event, data = {}) {
    this.events.push({
      event,
      data,
      time: new Date().toISOString(),
    });
  }

  getEvents() {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }

  count() {
    return this.events.length;
  }
}

export const analyticsService = new AnalyticsService();
