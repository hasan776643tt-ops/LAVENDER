import {
  useState,
  useContext,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Map() {


  const {

    farms,
    locations,
    setLocations,

  } = useContext(FarmContext);



  const [farmId, setFarmId] =
    useState("");

  const [locationType, setLocationType] =
    useState("مزرعة");


  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");


  const [accuracy, setAccuracy] =
    useState("");


  const [locationTime, setLocationTime] =
    useState("");


  const [notes, setNotes] =
    useState("");


  const [loading, setLoading] =
    useState(false);





  const getCurrentLocation = () => {


    if (!navigator.geolocation) {

      alert(
        "GPS غير مدعوم في هذا الجهاز"
      );

      return;

    }



    setLoading(true);



    navigator.geolocation.getCurrentPosition(

      (position)=>{


        setLatitude(
          position.coords.latitude.toFixed(6)
        );


        setLongitude(
          position.coords.longitude.toFixed(6)
        );


        setAccuracy(
          Math.round(
            position.coords.accuracy
          )
        );


        setLocationTime(
          new Date().toLocaleString("ar-SY")
        );


        setLoading(false);


      },


      ()=>{


        alert(
          "يرجى السماح باستخدام الموقع"
        );


        setLoading(false);


      },


      {

        enableHighAccuracy:true,

        timeout:15000,

        maximumAge:0,

      }

    );


  };





  const addLocation = () => {


    if(
      !farmId ||
      !latitude ||
      !longitude
    ){

      alert(
        "اختر المزرعة وحدد الموقع أولاً"
      );

      return;

    }



    const farm = farms.find(
      item =>
      item.id === farmId
    );



    const newLocation = {


      id:
        Date.now(),


      farmId,


      farmName:
        farm?.name || "غير محدد",


      type:
        locationType,


      latitude,


      longitude,


      accuracy,


      notes,


      createdAt:
        locationTime,


      status:
        "نشط"

    };



    setLocations([

      ...locations,

      newLocation

    ]);



    setFarmId("");

    setLatitude("");

    setLongitude("");

    setAccuracy("");

    setLocationTime("");

    setNotes("");



    alert(
      "تم حفظ الموقع بنجاح"
    );


  };





  const deleteLocation = (id)=>{


    setLocations(

      locations.filter(

        item =>
        item.id !== id

      )

    );


  };





  return (

    <div>


      <h1>
        📍 نظام المواقع الذكي
      </h1>



      <Card title="تسجيل موقع جديد">


        <select

          value={farmId}

          onChange={
            (e)=>
            setFarmId(e.target.value)
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

                  value={farm.id}

                >

                  {farm.name}

                </option>

              )

            )
          }


        </select>



        <br/><br/>



        <select

          value={locationType}

          onChange={
            (e)=>
            setLocationType(e.target.value)
          }

        >

          <option>
            مزرعة
          </option>

          <option>
            حقل
          </option>

          <option>
            مصدر مياه
          </option>


        </select>



        <br/><br/>



        <Button

          onClick={getCurrentLocation}

        >

          {
            loading
            ?
            "⏳ جاري تحديد الموقع..."
            :
            "📡 تحديد GPS"
          }


        </Button>



        <br/><br/>



        <input

          value={latitude}

          readOnly

          placeholder="Latitude"

        />


        <br/><br/>



        <input

          value={longitude}

          readOnly

          placeholder="Longitude"

        />


        <br/><br/>



        <input

          value={
            accuracy
            ?
            `${accuracy} متر`
            :
            ""
          }

          readOnly

          placeholder="Accuracy"

        />


        <br/><br/>



        <input

          value={locationTime}

          readOnly

          placeholder="وقت التسجيل"

        />


        <br/><br/>



        <textarea

          value={notes}

          onChange={
            (e)=>
            setNotes(e.target.value)
          }

          placeholder="ملاحظات الموقع"

        />



        <br/><br/>



        <Button

          onClick={addLocation}

        >

          💾 حفظ الموقع

        </Button>


      </Card>





      <h2>
        🗺️ المواقع المحفوظة
      </h2>



      {

        locations.map(

          item=>(


            <Card

              key={item.id}

              title={item.farmName}

            >


              <p>
                📌 النوع:
                {" "}
                {item.type}
              </p>


              <p>
                🌍 Latitude:
                {" "}
                {item.latitude}
              </p>


              <p>
                🌍 Longitude:
                {" "}
                {item.longitude}
              </p>


              <p>
                🎯 الدقة:
                {" "}
                {item.accuracy}
                متر
              </p>


              <p>
                📝 الملاحظات:
                {" "}
                {item.notes}
              </p>


              <a

                href={
`https://maps.google.com/?q=${item.latitude},${item.longitude}`
                }

                target="_blank"

                rel="noreferrer"

              >

                🗺️ فتح في Google Maps

              </a>


              <br/><br/>


              <Button

                onClick={()=>
                  deleteLocation(item.id)
                }

              >

                حذف

              </Button>


            </Card>


          )

        )

      }


    </div>

  );

}
