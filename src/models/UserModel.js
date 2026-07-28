// src/models/UserModel.js

export default class UserModel {
  constructor(data = {}) {
    this.id = data.id ?? crypto.randomUUID();

    this.name = data.name ?? "";
    this.username = data.username ?? "";
    this.email = data.email ?? "";
    this.phone = data.phone ?? "";

    this.password = data.password ?? "";

    this.role = data.role ?? "farmer";
    // farmer | engineer | admin

    this.status = data.status ?? "active";
    // active | inactive | blocked

    this.avatar = data.avatar ?? "";

    this.language = data.language ?? "ar";
    this.timeZone = data.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.createdAt = data.createdAt ?? new Date().toISOString();
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  update(data = {}) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role,
      status: this.status,
      avatar: this.avatar,
      language: this.language,
      timeZone: this.timeZone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data) {
    return new UserModel(data);
  }
}
