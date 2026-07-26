import { useState } from "react";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Weather() {

  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);

  const checkWeather = () => {

    if (!location) return;

    const newWeather = {

      location,

      temperature: "28°C",

      humidity: "55%",

      wind: "12 كم/ساعة",

      rain: "0%",

      condition: "مشمس",

      uv: "مرتفع",

      recommendation:
        "ينصح بالري في ساعات المساء",

      alert:
        "لا توجد تحذيرات حالياً",

    };

    setWeather(newWeather);

  };

  return (
    <div>

      <h1>☀️ الطقس الزراعي</h1>

      <Card title="البحث عن حالة الطقس">

        <input
          type="text"
          placeholder="اسم القرية أو المنطقة"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

        <br /><br />

        <Button onClick={checkWeather}>
          عرض الطقس
        </Button>

      </Card>

      {weather && (

        <Card
          title={`📍 ${weather.location}`}
        >

          <p>
            🌡️ درجة الحرارة:
            {" "}
            {weather.temperature}
          </p>

          <p>
            💧 الرطوبة:
            {" "}
            {weather.humidity}
          </p>

          <p>
            💨 سرعة الرياح:
            {" "}
            {weather.wind}
          </p>

          <p>
            🌧️ احتمال المطر:
            {" "}
            {weather.rain}
          </p>

          <p>
            ☀️ الحالة الجوية:
            {" "}
            {weather.condition}
          </p>

          <p>
            🔆 مؤشر الأشعة:
            {" "}
            {weather.uv}
          </p>

          <p>
            🌱 التوصية الزراعية:
            {" "}
            {weather.recommendation}
          </p>

          <p>
            🔔 التنبيه:
            {" "}
            {weather.alert}
          </p>

        </Card>

      )}

    </div>
  );
}
