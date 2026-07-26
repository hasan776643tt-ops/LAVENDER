const getCurrentLocation = () => {

  if (!navigator.geolocation) {

    alert("المتصفح لا يدعم GPS");

    return;

  }

  navigator.geolocation.getCurrentPosition(

    (position) => {

      setLatitude(
        position.coords.latitude.toString()
      );

      setLongitude(
        position.coords.longitude.toString()
      );

    },

    () => {

      alert(
        "تعذر الحصول على الموقع"
      );

    }

  );

};
