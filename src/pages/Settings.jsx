// src/pages/Settings.jsx

import Card from "../components/Card";
import Button from "../components/Button";

import { useSettings } from "../context/SettingsContext";

import { languages } from "../config/languages";
import { currencies } from "../config/currencies";
import { units } from "../config/units";
import { countries } from "../config/countries";

import { translate } from "../utils/translation";


export default function Settings() {

  const {
    settings,
    updateSetting,
    resetSettings
  } = useSettings();


  const language =
    settings?.language || "ar";


  return (

    <div>

      <h1>
        ⚙️ {translate(
          "settings.title",
          language
        )}
      </h1>


      <Card
        title={`🌍 ${translate(
          "settings.global",
          language
        )}`}
      >

        <select
          value={settings.language}
          onChange={(e) =>
            updateSetting(
              "language",
              e.target.value
            )
          }
        >

          {languages.map((lang) => (

            <option
              key={lang.code}
              value={lang.code}
            >
              {lang.name}
            </option>

          ))}

        </select>


        <br />
        <br />


        <select
          value={settings.country}
          onChange={(e) =>
            updateSetting(
              "country",
              e.target.value
            )
          }
        >

          {countries.map((country) => (

            <option
              key={country.code}
              value={country.code}
            >
              {translate(
                `country.${country.code}`,
                language
              )}
            </option>

          ))}

        </select>


        <br />
        <br />


        <select
          value={settings.currency}
          onChange={(e) =>
            updateSetting(
              "currency",
              e.target.value
            )
          }
        >

          {currencies.map((currency) => (

            <option
              key={currency.code}
              value={currency.code}
            >
              {translate(
                `currency.${currency.code}`,
                language
              )}
            </option>

          ))}

        </select>

      </Card>


      <Card
        title={`📏 ${translate(
          "settings.measurement",
          language
        )}`}
      >

        <select
          value={settings.areaUnit}
          onChange={(e) =>
            updateSetting(
              "areaUnit",
              e.target.value
            )
          }
        >

          {units.area.map((unit) => (

            <option
              key={unit.code}
              value={unit.code}
            >
              {translate(
                `unit.${unit.code}`,
                language
              )}
            </option>

          ))}

        </select>


        <br />
        <br />


        <select
          value={settings.weightUnit}
          onChange={(e) =>
            updateSetting(
              "weightUnit",
              e.target.value
            )
          }
        >

          {units.weight.map((unit) => (

            <option
              key={unit.code}
              value={unit.code}
            >
              {translate(
                `unit.${unit.code}`,
                language
              )}
            </option>

          ))}

        </select>


        <br />
        <br />


        <select
          value={settings.waterUnit}
          onChange={(e) =>
            updateSetting(
              "waterUnit",
              e.target.value
            )
          }
        >

          {units.water.map((unit) => (

            <option
              key={unit.code}
              value={unit.code}
            >
              {translate(
                `unit.${unit.code}`,
                language
              )}
            </option>

          ))}

        </select>

      </Card>


      <Card
        title={`🔔 ${translate(
          "settings.systemLocation",
          language
        )}`}
      >

        <label>

          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              updateSetting(
                "notifications",
                e.target.checked
              )
            }
          />

          {" "}

          {translate(
            "settings.notifications",
            language
          )}

        </label>


        <br />
        <br />


        <label>

          <input
            type="checkbox"
            checked={settings.gps}
            onChange={(e) =>
              updateSetting(
                "gps",
                e.target.checked
              )
            }
          />

          {" "}

          {translate(
            "settings.gps",
            language
          )}

        </label>

      </Card>


      <Card
        title={`🌱 ${translate(
          "settings.information",
          language
        )}`}
      >

        <p>
          LAVENDER Smart Farm
        </p>

        <p>
          {translate(
            "settings.description",
            language
          )}
        </p>

      </Card>


      <Button
        onClick={resetSettings}
      >

        {translate(
          "settings.reset",
          language
        )}

      </Button>

    </div>

  );

}
