// src/config/units.js


const units = Object.freeze({

  area: Object.freeze([

    Object.freeze({

      code: "dunum",

      name: "دونم"

    }),

    Object.freeze({

      code: "hectare",

      name: "هكتار"

    }),

    Object.freeze({

      code: "acre",

      name: "فدان"

    }),

    Object.freeze({

      code: "sqm",

      name: "متر مربع"

    })

  ]),



  weight: Object.freeze([

    Object.freeze({

      code: "kg",

      name: "كيلوغرام"

    }),

    Object.freeze({

      code: "ton",

      name: "طن"

    })

  ]),



  water: Object.freeze([

    Object.freeze({

      code: "liter",

      name: "لتر"

    }),

    Object.freeze({

      code: "cubic_meter",

      name: "متر مكعب"

    })

  ]),



  volume: Object.freeze([

    Object.freeze({

      code: "liter",

      name: "لتر"

    })

  ])

});


export default units;
