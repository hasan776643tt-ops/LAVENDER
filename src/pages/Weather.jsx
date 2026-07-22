import { useState } from "react";

export default function Weather() {

  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);


  const checkWeather = () => {

    if (!location) return;


    const newWeather = {

      location: location,

      temperature: "28°C",

      humidity: "55%",

      wind: "12 كم/ساعة",

      rain: "0%",

      condition: "مشمس",

      alert: "لا توجد تحذيرات حاليا",

    };


    setWeather(newWeather);

  };


  return (
    <div>

      <h1>☁️ حالة الطقس</h1>


      <h2>
        البحث عن طقس المزرعة
      </h2>


      <input
        type="text"
        placeholder="اكتب موقع المزرعة"
        value={location}
        onChange={(e)=>setLocation(e.target.value)}
      />


      <br /><br />


      <button onClick={checkWeather}>
        عرض الطقس
      </button>


      <hr />


      {weather && (

        <div>

          <h2>
            📍 {weather.location}
          </h2>


          <ul>

            <li>
              🌡️ الحرارة: {weather.temperature}
            </li>

            <li>
              💧 الرطوبة: {weather.humidity}
            </li>

            <li>
              💨 الرياح: {weather.wind}
            </li>

            <li>
              🌧️ الأمطار: {weather.rain}
            </li>

            <li>
              ☀️ الحالة: {weather.condition}
            </li>

            <li>
              🔔 التنبيه: {weather.alert}
            </li>

          </ul>


        </div>

      )}


    </div>
  );
}
