class NotificationService {
  async success(message) {
    console.log("SUCCESS:", message);
  }

  async error(message) {
    console.error("ERROR:", message);
  }

  async warning(message) {
    console.warn("WARNING:", message);
  }

  async info(message) {
    console.info("INFO:", message);
  }

  async send(notification) {
    return {
      success: true,
      notification,
    };
  }
}

export const notificationService = new NotificationService();
