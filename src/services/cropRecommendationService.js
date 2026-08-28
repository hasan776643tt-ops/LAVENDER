// src/services/cropRecommendationService.js

const SEEDS = Object.freeze({

  cold: [
    "قمح شتوي",
    "شعير",
    "شوفان",
  ],

  moderate: [
    "قمح",
    "شعير",
    "ذرة",
    "عباد الشمس",
  ],

  hot: [
    "ذرة",
    "دخن",
    "سورغم",
    "سمسم",
  ],

});


const LABELS = Object.freeze({

  cold: "الباردة",

  moderate: "المعتدلة",

  hot: "الحارة",

});


function climateFromLatitude(latitude) {

  const value = Number(latitude);

  if (!Number.isFinite(value)) {

    return null;

  }


  const absolute =
    Math.abs(value);


  if (absolute >= 50) {

    return "cold";

  }


  if (absolute >= 25) {

    return "moderate";

  }


  return "hot";

}


class CropRecommendationService {

  recommend(location = {}) {

    const climate =
      location?.climate ||
      climateFromLatitude(
        location?.latitude
      );


    if (!climate) {

      return null;

    }


    const seeds =
      SEEDS[climate] || [];


    return {

      climate,

      climateLabel:
        LABELS[climate] ||
        climate,

      message:
        `المنطقة ${LABELS[climate]}، وهذه بذور مناسبة مبدئيًا للزراعة فيها.`,

      seeds,

    };

  }

}


export default Object.freeze(
  new CropRecommendationService()
);
