// src/utils/geoUtils.js


export function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {


  const earthRadius =
    6371;



  const dLat =
    toRadians(
      lat2 - lat1
    );



  const dLon =
    toRadians(
      lon2 - lon1
    );



  const a =

    Math.sin(
      dLat / 2
    ) ** 2

    +

    Math.cos(
      toRadians(lat1)
    )

    *

    Math.cos(
      toRadians(lat2)
    )

    *

    Math.sin(
      dLon / 2
    ) ** 2;



  const c =
    2 *

    Math.atan2(

      Math.sqrt(a),

      Math.sqrt(
        1 - a
      )

    );



  return (

    earthRadius *

    c

  );


}



export function toRadians(
  degrees
) {


  return (

    degrees *

    Math.PI

    /

    180

  );


}



export function validateCoordinates(
  latitude,
  longitude
) {


  return (

    typeof latitude === "number"

    &&

    typeof longitude === "number"

    &&

    latitude >= -90

    &&

    latitude <= 90

    &&

    longitude >= -180

    &&

    longitude <= 180

  );


}



export function createLocationObject(
  latitude,
  longitude,
  accuracy = null
) {


  return {


    latitude,

    longitude,

    accuracy,

    timestamp:
      Date.now()


  };


}



export function getBoundingBox(
  latitude,
  longitude,
  radiusKm = 1
) {


  const latDelta =
    radiusKm / 111;



  const lonDelta =
    radiusKm /

    (

      111 *

      Math.cos(
        toRadians(latitude)
      )

    );



  return {


    north:
      latitude + latDelta,


    south:
      latitude - latDelta,


    east:
      longitude + lonDelta,


    west:
      longitude - lonDelta


  };


}



export default {


  calculateDistance,

  toRadians,

  validateCoordinates,

  createLocationObject,

  getBoundingBox


};
