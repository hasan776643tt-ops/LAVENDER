class SyncService {
  async upload(data) {
    return {
      success: true,
      data,
      message: "Upload completed."
    };
  }

  async download() {
    return {
      success: true,
      data: null
    };
  }

  async sync(localData) {
    return {
      success: true,
      data: localData
    };
  }

  async status() {
    return {
      online: navigator.onLine,
      lastSync: null
    };
  }
}

export const syncService = new SyncService();
