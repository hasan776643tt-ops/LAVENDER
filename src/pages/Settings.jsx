import Card from "../components/Card";
import Button from "../components/Button";

import { useSettings } from "../context/SettingsContext";

import { languages } from "../config/languages";
import { currencies } from "../config/currencies";
import { units } from "../config/units";
import { countries } from "../config/countries";


export default function Settings() {

  const {
    settings,
    updateSetting,
    resetSettings
  } = useSettings();


  return (

    <div>

      <h1>
        ⚙️ إعدادات النظام
      </h1>


      <Card title="🌍 الإعدادات العالمية">


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


        <br /><br />


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
              {country.name}
            </option>

          ))}

        </select>


        <br /><br />


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
              {currency.name}
            </option>

          ))}

        </select>


      </Card>



      <Card title="📏 وحدات القياس">


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
              {unit.name}
            </option>

          ))}

        </select>


        <br /><br />


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
              {unit.name}
            </option>

          ))}

        </select>


        <br /><br />


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
              {unit.name}
            </option>

          ))}

        </select>


      </Card>



      <Card title="🔔 النظام والموقع">


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

          تفعيل الإشعارات

        </label>


        <br /><br />


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

          تفعيل GPS

        </label>


      </Card>



      <Card title="🌱 معلومات LAVENDER">

        <p>
          LAVENDER Smart Farm
        </p>

        <p>
          نظام إدارة زراعي ذكي عالمي
        </p>

      </Card>



      <Button
        onClick={resetSettings}
      >
        إعادة الإعدادات الافتراضية
      </Button>


    </div>

  );

}
