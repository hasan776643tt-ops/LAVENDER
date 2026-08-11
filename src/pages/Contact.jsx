// src/pages/Contact.jsx

import { useState } from "react";

const CONTACT_MESSAGES_KEY = "lavender_contact_messages";

const initialForm = Object.freeze({
  name: "",
  email: "",
  message: ""
});

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));

    setStatus("");
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError("يرجى تعبئة جميع الحقول.");
      setStatus("");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح.");
      setStatus("");
      return;
    }

    try {
      const storedMessages =
        localStorage.getItem(
          CONTACT_MESSAGES_KEY
        );

      const messages = storedMessages
        ? JSON.parse(storedMessages)
        : [];

      const newMessage = {
        id: crypto.randomUUID(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      };

      const updatedMessages = [
        ...messages,
        newMessage
      ];

      localStorage.setItem(
        CONTACT_MESSAGES_KEY,
        JSON.stringify(updatedMessages)
      );

      setForm(initialForm);
      setError("");
      setStatus(
        "تم إرسال رسالتك وحفظها بنجاح."
      );
    } catch {
      setError(
        "تعذر حفظ الرسالة. حاول مرة أخرى."
      );
      setStatus("");
    }
  };

  return (
    <div>
      <h1>تواصل معنا</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="contact-name">
            الاسم
          </label>
          <br />

          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="اكتب اسمك"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="contact-email">
            البريد الإلكتروني
          </label>
          <br />

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="contact-message">
            الرسالة
          </label>
          <br />

          <textarea
            id="contact-message"
            name="message"
            rows="5"
            placeholder="اكتب رسالتك هنا"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <br />

        <button type="submit">
          إرسال
        </button>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {status && (
          <p role="status">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
