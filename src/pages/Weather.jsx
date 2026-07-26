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



  const [selectedFarm,setSelectedFarm] =
    useState("");

  const [weather,setWeather] =
    useState(null);

  const [loading,setLoading] =
    useState(false);





  // البحث عن موقع المزرعة

  const farmLocation = useMemo(()=>{


    return locations.find(

      item =>
        item.farm === selectedFarm

    );


  },[
    locations,
    selectedFarm
  ]);







  // محاكاة الطقس الذكي مؤقتاً
  // جاهز للربط مع API

  const getWeather = ()=>{


    if(!selectedFarm)
      return;


    setLoading(true);



    setTimeout(()=>{


      const temperature =
        28;


      const humidity =
        55;



      let recommendation =
        "✅ الظروف مناسبة للزراعة";



      if(
        temperature > 35
      ){

        recommendation =
        "⚠️ حرارة مرتفعة، يفضل زيادة مراقبة الري";

      }



      if(
        humidity < 30
      ){

        recommendation =
        "💧 رطوبة منخفضة، راقب جفاف التربة";

      }





      setWeather({

        temperature,

        humidity,

        wind:
        "12 كم/ساعة",

        rain:
        "10%",

        condition:
        "مشمس",

        recommendation,

        location:
        farmLocation

      });



      setLoading(false);



    },800);


  };








  return (

    <div>


      <h1>
        ☀️ الطقس الزراعي الذكي
      </h1>





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
              farm=>(

                <option

                  key={farm.id}

                  value={farm.name}

                >

                  {farm.name}

                </option>

              )
            )
          }


        </select>



        <br/><br/>




        <Button
          onClick={getWeather}
        >

          {
            loading
            ?
            "⏳ جاري التحليل..."
            :
            "🌦️ عرض الطقس"
          }


        </Button>



      </Card>








      {
        weather &&


        <Card title="🌤️ حالة الطقس">


          {
            weather.location &&

            <>

            <p>
              📍 الموقع:
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
            🌡️ الحرارة:
            {" "}
            {weather.temperature}°C
          </p>


          <p>
            💧 الرطوبة:
            {" "}
            {weather.humidity}%
          </p>


          <p>
            🌬️ الرياح:
            {" "}
            {weather.wind}
          </p>


          <p>
            🌧️ احتمال المطر:
            {" "}
            {weather.rain}
          </p>


          <p>
            ☀️ الحالة:
            {" "}
            {weather.condition}
          </p>


          <h3>
            🌱 التوصية الزراعية
          </h3>


          <p>
            {weather.recommendation}
          </p>



        </Card>


      }





      <Card title="🚀 التطوير القادم">


        <p>
          🌍 ربط API طقس حقيقي.
        </p>


        <p>
          📡 تحديث تلقائي حسب GPS.
        </p>


        <p>
          🤖 تنبؤ ذكي بالري.
        </p>


        <p>
          🔔 تنبيهات للمزارع.
        </p>


      </Card>



    </div>

  );

}
