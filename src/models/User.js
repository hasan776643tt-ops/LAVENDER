export class User {
  constructor({
    id = null,
    name = "",
    email = "",
    phone = "",
    role = "farmer",
    avatar = "",
    language = "ar",
    isActive = true,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.avatar = avatar;
    this.language = language;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  update(data = {}) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date().toISOString();
  }

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      avatar: this.avatar,
      language: this.language,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
