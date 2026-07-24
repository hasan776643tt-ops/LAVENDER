class AuthService {
  constructor() {
    this.user = null;
  }

  login(user) {
    this.user = user;
    return this.user;
  }

  logout() {
    this.user = null;
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return this.user !== null;
  }
}

export const authService = new AuthService();
