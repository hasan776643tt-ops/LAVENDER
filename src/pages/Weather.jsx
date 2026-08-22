// src/pages/Weather.jsx

import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import useWeather
  from "../hooks/useWeather.js";

import Card
  from "../components/Card";

import Button
  from "../components/Button";


export default function Weather() {

  const {
    farms = [],
    locations = [],
  } = useContext(FarmContext);


  const {
    weather,
    loading,
    error,
    getWeather,
    farmAdvice,
  } = useWeather();


  const [selectedFarm, setSelectedFarm] =
    useState("");


  // =========================
  // Farm Location
  // =========================

  const farmLocation = useMemo(() => {

    return locations.find(

      location =>
        String(location.farmId) ===
        String(selectedFarm)

    ) || null;

  }, [

    locations,

    selectedFarm

  ]);



  // =========================
  // Get Weather
  // =========================

  const handleGetWeather = async () => {

    if (!selectedFarm) {

      alert(
        "اختر المزرعة أولاً"
      );

      return;

    }


    if (!farmLocation) {

      alert(
        "لا يوجد موقع GPS مرتبط بهذه المزرعة"
      );

      return;

    }


    try {

      await getWeather({

        latitude:
          farmLocation.latitude ??
          farmLocation.lat,

        longitude:
          farmLocation.longitude ??
          farmLocation.lng,

      });

    } catch (err) {

      console.error(
        "Weather error:",
        err
      );

    }

  };



  // =========================
  // UI
  // =========================

  return (

    <div>

      <h1>
        ☀️ نظام الطقس الزراعي الذكي
      </h1>


      <p>
        تحليل الظروف الجوية وتأثيرها على المحاصيل.
      </p>



      <Card
        title="📍 اختيار المزرعة"
      >

        <select

          value={selectedFarm}

          onChange={(e) =>
            setSelectedFarm(
              e.target.value
            )
          }

        >

          <option value="">
            اختر المزرعة
          </option>


          {farms.map(

            farm => (

              <option

                key={farm.id}

                value={farm.id}

              >

                {farm.name}

              </option>

            )

          )}

        </select>


        <br />
        <br />


        <Button
          onClick={handleGetWeather}
          disabled={loading}
        >

          {loading

            ? "⏳ جاري التحليل..."

            : "🌦️ تحليل الطقس"

          }

        </Button>


      </Card>



      {error && (

        <Card
          title="⚠️ خطأ في الطقس"
        >

          <p>
            {error.message ||
              "حدث خطأ أثناء جلب بيانات الطقس."}
          </p>

        </Card>

      )}



      {weather && (

        <Card
          title="🌤️ البيانات الجوية"
        >

          {weather.location && (

            <>

              <p>
                📍 الموقع:
                {" "}
                {typeof weather.location === "object"

                  ? (
                      weather.location.latitude ??
                      weather.location.lat
                    )
                  : weather.location

                }

                {typeof weather.location === "object" &&
                  (

                    weather.location.longitude ??
                    weather.location.lng

                  ) != null && (

                    <>
                      {" , "}

                      {
                        weather.location.longitude ??
                        weather.location.lng
                      }

                    </>

                  )

                }

              </p>

            </>

          )}



          <p>
            🌡️ الحرارة الحالية:
            {" "}
            {weather.temperature ?? "--"}
            °C
          </p>



          <p>
            🔽 الصغرى:
            {" "}
            {weather.minTemperature ?? "--"}
            °C
          </p>



          <p>
            🔼 العظمى:
            {" "}
            {weather.maxTemperature ?? "--"}
            °C
          </p>



          <p>
            💧 الرطوبة:
            {" "}
            {weather.humidity ?? "--"}
            %
          </p>



          <p>
            💨 سرعة الرياح:
            {" "}
            {weather.windSpeed ?? "--"}
            كم/ساعة
          </p>



          <p>
            🌧️ احتمال المطر:
            {" "}
            {weather.rainChance ?? "--"}
            %
          </p>



          <p>
            ☀️ الحالة:
            {" "}
            {weather.condition ?? "--"}
          </p>



          <p>
            🕒 آخر تحديث:
            {" "}
            {
              weather.updated ??
              weather.updatedAt ??
              "--"
            }

          </p>


        </Card>

      )}



      {weather && (

        <Card
          title="🌱 التوصيات الزراعية الذكية"
        >

          <p>
            {farmAdvice()}
          </p>

        </Card>

      )}



      <Card
        title="🚀 جاهزية التطوير المستقبلي"
      >

        <p>
          🌍 ربط API طقس عالمي.
        </p>


        <p>
          📡 تحديث تلقائي عبر GPS.
        </p>


        <p>
          🤖 توقع احتياجات الري بالذكاء الاصطناعي.
        </p>


        <p>
          🌡️ ربط حساسات التربة والبيوت الزراعية.
        </p>


        <p>
          🔔 إرسال تنبيهات للمزارع.
        </p>

      </Card>


    </div>

  );

}
