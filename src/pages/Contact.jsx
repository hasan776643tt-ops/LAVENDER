// src/pages/Contact.jsx

import { useState } from "react";

import { useSettings } from "../context/SettingsContext";
import { translate } from "../utils/translation";


const CONTACT_MESSAGES_KEY =
  "lavender_contact_messages";


const initialForm =
  Object.freeze({
    name: "",
    email: "",
    message: ""
  });


export default function Contact() {

  const {
    settings
  } = useSettings();


  const language =
    settings?.language || "ar";


  const [form, setForm] =
    useState(initialForm);

  const [status, setStatus] =
    useState("");

  const [error, setError] =
    useState("");


  const handleChange =
    (event) => {

      const {
        name,
        value
      } = event.target;


      setForm(
        (currentForm) => ({

          ...currentForm,

          [name]: value

        })
      );


      setStatus("");
      setError("");

    };


  const handleSubmit =
    (event) => {

      event.preventDefault();


      const name =
        form.name.trim();

      const email =
        form.email.trim();

      const message =
        form.message.trim();


      if (
        !name ||
        !email ||
        !message
      ) {

        setError(
          translate(
            "contact.required",
            language
          )
        );

        setStatus("");

        return;

      }


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(email)
      ) {

        setError(
          translate(
            "contact.invalidEmail",
            language
          )
        );

        setStatus("");

        return;

      }


      try {

        const storedMessages =
          localStorage.getItem(
            CONTACT_MESSAGES_KEY
          );


        const messages =
          storedMessages
            ? JSON.parse(storedMessages)
            : [];


        const newMessage = {

          id:
            crypto.randomUUID(),

          name,

          email,

          message,

          createdAt:
            new Date().toISOString()

        };


        const updatedMessages =
          [
            ...messages,
            newMessage
          ];


        localStorage.setItem(

          CONTACT_MESSAGES_KEY,

          JSON.stringify(
            updatedMessages
          )

        );


        setForm(
          initialForm
        );

        setError("");


        setStatus(
          translate(
            "contact.success",
            language
          )
        );


      } catch {

        setError(
          translate(
            "contact.saveError",
            language
          )
        );

        setStatus("");

      }

    };


  return (

    <div>

      <h1>
        {translate(
          "contact.title",
          language
        )}
      </h1>


      <form
        onSubmit={handleSubmit}
      >

        <div>

          <label
            htmlFor="contact-name"
          >
            {translate(
              "contact.name",
              language
            )}
          </label>

          <br />

          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder={
              translate(
                "contact.namePlaceholder",
                language
              )
            }
            value={form.name}
            onChange={handleChange}
            required
          />

        </div>


        <br />


        <div>

          <label
            htmlFor="contact-email"
          >
            {translate(
              "contact.email",
              language
            )}
          </label>

          <br />

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder={
              translate(
                "contact.emailPlaceholder",
                language
              )
            }
            value={form.email}
            onChange={handleChange}
            required
          />

        </div>


        <br />


        <div>

          <label
            htmlFor="contact-message"
          >
            {translate(
              "contact.message",
              language
            )}
          </label>

          <br />

          <textarea
            id="contact-message"
            name="message"
            rows="5"
            placeholder={
              translate(
                "contact.messagePlaceholder",
                language
              )
            }
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>

        </div>


        <br />


        <button type="submit">

          {translate(
            "contact.send",
            language
          )}

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
