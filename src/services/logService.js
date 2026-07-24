class LogService {
  constructor() {
    this.logs = [];
  }

  info(message) {
    this.logs.push({
      type: "info",
      message,
      time: new Date().toISOString(),
    });
  }

  warning(message) {
    this.logs.push({
      type: "warning",
      message,
      time: new Date().toISOString(),
    });
  }

  error(message) {
    this.logs.push({
      type: "error",
      message,
      time: new Date().toISOString(),
    });
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logService = new LogService();
