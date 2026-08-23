import { useSettings } from "../context/SettingsContext";
import { translate } from "../utils/translation";

const currentYear = new Date().getFullYear();

export default function Footer() {

  const { settings } = useSettings();

  const language =
    settings?.language || "ar";

  return (

    <footer className="app-footer">

      <div className="footer-brand">

        المزرعة الذكية

      </div>

      <div
        style={{
          fontSize: "12px",
          letterSpacing: "3px",
          marginBottom: "10px",
        }}
      >
        LAVENDER
      </div>

      <div className="footer-copy">

        © {currentYear}

        {" "}

        {translate(
          "footer.rights",
          language
        )}

      </div>

    </footer>

  );

}
