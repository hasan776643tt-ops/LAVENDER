// src/components/Footer.jsx

import { useSettings } from "../context/SettingsContext";
import { translate } from "../utils/translation";


const currentYear =
  new Date().getFullYear();


export default function Footer() {

  const { settings } =
    useSettings();

  const language =
    settings?.language || "ar";


  return (

    <footer className="app-footer">

      <div className="footer-brand">

        🌱 LAVENDER Smart Farm

      </div>


      <div className="footer-description">

        {translate(
          "footer.description",
          language
        )}

        <br />

        {translate(
          "footer.management",
          language
        )}

      </div>


      <div className="footer-copy">

        © {currentYear}{" "}

        {translate(
          "footer.rights",
          language
        )}

      </div>


    </footer>

  );

}
