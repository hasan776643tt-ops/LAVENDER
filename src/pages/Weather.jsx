import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Weather() {


  const {

    farms = [],
    locations = [],

  } = useContext(FarmContext);



  const [selectedFarm, setSelectedFarm] =
    useState("");

  const [weather, setWeather] =
    useState(null);

  const [loading, setLoading] =
    useState(false);



  // البحث عن موقع المزرعة بالمعرف

  const farmLocation = useMemo(() => {

    return locations.find(

      location =>
        location.farmId === selectedFarm

    );

  }, [
    locations,
    selectedFarm
  ]);




  // تحليل زراعي ذكي

  const analyzeAgriculture = (
    temperature,
    humidity,
    rain
  ) => {


    let advice = [];



    if (temperature >= 35) {

      advice.push(
        "⚠️ حرارة مرتفعة: يفضل زيادة مراقبة الري."
      );

    }



    if (humidity < 40) {

      advice.push(
        "💧 رطوبة منخفضة: احتمال جفاف التربة."
      );

    }



    if (rain < 20) {

      advice.push(
        "🌱 الأمطار قليلة: راجع خطة الري."
      );

    }



    if (temperature >= 20 &&
        temperature <= 30 &&
        humidity >= 40) {

      advice.push(
        "✅ الظروف مناسبة لنمو معظم المحاصيل."
      );

    }



    return advice;

  };






  const getWeather = () => {


    if (!selectedFarm) {

      alert(
        "اختر المزرعة أولاً"
      );

      return;

    }



    setLoading(true);



    // جاهز للاستبدال بـ API حقيقي

    setTimeout(() => {


      const data = {


        temperature: 28,

        minTemperature: 21,

        maxTemperature: 32,


        humidity: 55,


        windSpeed: 12,


        rainChance: 10,


        condition:
          "مشمس",


        updated:
          new Date()
          .toLocaleString("ar"),


      };




      setWeather({

        ...data,


        location:
          farmLocation,


        recommendations:
          analyzeAgriculture(

            data.temperature,

            data.humidity,

            data.rainChance

          )

      });



      setLoading(false);



    },700);



  };







  return (

    <div>


      <h1>
        ☀️ نظام الطقس الزراعي الذكي
      </h1>


      <p>
        تحليل الظروف الجوية وتأثيرها على المحاصيل.
      </p>





      <Card title="📍 اختيار المزرعة">


        <select

          value={selectedFarm}

          onChange={(e)=>
            setSelectedFarm(
              e.target.value
            )
          }

        >

          <option value="">

            اختر المزرعة

          </option>


          {
            farms.map(
              farm => (

                <option

                  key={farm.id}

                  value={farm.id}

                >

                  {farm.name}

                </option>

              )
            )
          }


        </select>



        <br />
        <br />



        <Button

          onClick={getWeather}

        >

          {

            loading

            ?

            "⏳ جاري التحليل..."

            :

            "🌦️ تحليل الطقس"

          }


        </Button>


      </Card>








      {
        weather &&

        <Card title="🌤️ البيانات الجوية">


          {
            weather.location &&

            <>

              <p>
                📍 الإحداثيات:
                {" "}
                {weather.location.lat}
                ,
                {weather.location.lng}
              </p>


              <p>
                🎯 دقة GPS:
                {" "}
                {weather.location.accuracy}
                متر
              </p>

            </>

          }



          <p>
            🌡️ الحرارة الحالية:
            {" "}
            {weather.temperature}
            °C
          </p>



          <p>
            🔽 الصغرى:
            {" "}
            {weather.minTemperature}
            °C
          </p>



          <p>
            🔼 العظمى:
            {" "}
            {weather.maxTemperature}
            °C
          </p>



          <p>
            💧 الرطوبة:
            {" "}
            {weather.humidity}
            %
          </p>



          <p>
            💨 سرعة الرياح:
            {" "}
            {weather.windSpeed}
            كم/ساعة
          </p>



          <p>
            🌧️ احتمال المطر:
            {" "}
            {weather.rainChance}
            %
          </p>



          <p>
            ☀️ الحالة:
            {" "}
            {weather.condition}
          </p>



          <p>
            🕒 آخر تحديث:
            {" "}
            {weather.updated}
          </p>


        </Card>

      }







      {
        weather &&


        <Card title="🌱 التوصيات الزراعية الذكية">


          {
            weather.recommendations.map(

              (item,index)=>(

                <p key={index}>
                  {item}
                </p>

              )

            )
          }


        </Card>

      }







      <Card title="🚀 جاهزية التطوير المستقبلي">


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
