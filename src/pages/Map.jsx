import { useState } from "react";

export default function Map() {

  const [farmName, setFarmName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [locations, setLocations] = useState([]);


  const addLocation = () => {

    if (!farmName) return;


    const newLocation = {

      id: Date.now(),

      name: farmName,

      lat: latitude,

      lng: longitude,

    };


    setLocations([
      ...locations,
      newLocation
    ]);


    setFarmName("");
    setLatitude("");
    setLongitude("");

  };


  const deleteLocation = (id) => {

    const updatedLocations =
      locations.filter(
        (item) => item.id !== id
      );

    setLocations(updatedLocations);

  };


  return (
    <div>

      <h1>📍 خريطة المزارع و GPS</h1>


      <input
        type="text"
        placeholder="اسم المزرعة"
        value={farmName}
        onChange={(e)=>setFarmName(e.target.value)}
      />


      <br /><br />


      <input
        type="number"
        placeholder="خط العرض Latitude"
        value={latitude}
        onChange={(e)=>setLatitude(e.target.value)}
      />


      <br /><br />


      <input
        type="number"
        placeholder="خط الطول Longitude"
        value={longitude}
        onChange={(e)=>setLongitude(e.target.value)}
      />


      <br /><br />


      <button onClick={addLocation}>
        إضافة موقع مزرعة
      </button>


      <hr />


      <div
        style={{
          width:"100%",
          height:"300px",
          border:"2px solid gray",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
        }}
      >

        🗺️ الخريطة ستظهر هنا لاحقًا

      </div>


      <h2>
        مواقع المزارع
      </h2>


      <ul>

        {locations.map((item)=>(

          <li key={item.id}>

            📍 {item.name}

            <br />

            Latitude: {item.lat}

            <br />

            Longitude: {item.lng}


            <button
              onClick={()=>deleteLocation(item.id)}
            >
              حذف
            </button>

          </li>

        ))}

      </ul>


    </div>
  );
}
