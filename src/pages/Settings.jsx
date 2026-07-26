import { useState } from "react";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Settings() {

  const [farmName, setFarmName] = useState("");

  const [language, setLanguage] =
    useState("العربية");

  const [theme, setTheme] =
    useState("فاتح");

  const [notifications, setNotifications] =
    useState(true);

  const [gps, setGps] =
    useState(true);

  const [areaUnit, setAreaUnit] =
    useState("دونم");

  const saveSettings = () => {

    alert("تم حفظ الإعدادات بنجاح");

  };

  return (

    <div>

      <h1>
        ⚙️ إعدادات النظام
      </h1>

      <Card title="إعدادات المزرعة">

        <input
          type="text"
          placeholder="اسم المزرعة"
          value={farmName}
          onChange={(e) =>
            setFarmName(
              e.target.value
            )
          }
        />

        <br /><br />

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
        >

          <option>
            العربية
          </option>

          <option>
            English
          </option>

          <option>
            Türkçe
          </option>

        </select>

        <br /><br />

        <select
          value={theme}
          onChange={(e) =>
            setTheme(
              e.target.value
            )
          }
        >

          <option>
            فاتح
          </option>

          <option>
            داكن
          </option>

        </select>

        <br /><br />

        <select
          value={areaUnit}
          onChange={(e) =>
            setAreaUnit(
              e.target.value
            )
          }
        >

          <option>
            دونم
          </option>

          <option>
            هكتار
          </option>

          <option>
            متر مربع
          </option>

        </select>

      </Card>

      <Card title="الإشعارات والموقع">

        <label>

          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) =>
              setNotifications(
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
            checked={gps}
            onChange={(e) =>
              setGps(
                e.target.checked
              )
            }
          />

          تفعيل الموقع التلقائي GPS

        </label>

      </Card>

      <Card title="معلومات النظام">

        <p>
          🌱 LAVENDER Smart Farm
        </p>

        <p>
          إصدار تجريبي
        </p>

        <p>
          إدارة المزارع والمحاصيل والري
          والتسميد والأمراض.
        </p>

      </Card>

      <Button
        onClick={saveSettings}
      >
        حفظ الإعدادات
      </Button>

    </div>

  );

}
