// src/config/units.js


const createUnit = ({
  code,
  name,
  symbol = null
}) =>
  Object.freeze({

    code,

    name,

    symbol

  });



const units = Object.freeze({


  area: Object.freeze([

    createUnit({

      code: "dunum",

      name: "دونم",

      symbol: "د"

    }),


    createUnit({

      code: "hectare",

      name: "هكتار",

      symbol: "ha"

    }),


    createUnit({

      code: "acre",

      name: "فدان",

      symbol: "ac"

    }),


    createUnit({

      code: "sqm",

      name: "متر مربع",

      symbol: "m²"

    })

  ]),



  weight: Object.freeze([

    createUnit({

      code: "kg",

      name: "كيلوغرام",

      symbol: "kg"

    }),


    createUnit({

      code: "ton",

      name: "طن",

      symbol: "t"

    })

  ]),



  water: Object.freeze([

    createUnit({

      code: "liter",

      name: "لتر",

      symbol: "L"

    }),


    createUnit({

      code: "cubic_meter",

      name: "متر مكعب",

      symbol: "m³"

    })

  ]),



  volume: Object.freeze([

    createUnit({

      code: "liter",

      name: "لتر",

      symbol: "L"

    })

  ]),



  temperature: Object.freeze([

    createUnit({

      code: "celsius",

      name: "مئوية",

      symbol: "°C"

    })

  ]),



  distance: Object.freeze([

    createUnit({

      code: "meter",

      name: "متر",

      symbol: "m"

    }),

    createUnit({

      code: "kilometer",

      name: "كيلومتر",

      symbol: "km"

    })

  ])


});


export { units };

