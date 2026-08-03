// src/config/menuConfig.js


const createMenuItem = ({
  id,
  titleKey,
  path,
  icon,
  module,
  permission = null,
  enabled = true
}) =>
  Object.freeze({

    id,

    titleKey,

    path,

    icon,

    module,

    permission,

    enabled

  });



const menuConfig = Object.freeze([


  createMenuItem({

    id: "dashboard",

    titleKey: "menu.dashboard",

    path: "/dashboard",

    icon: "dashboard",

    module: "dashboard"

  }),



  createMenuItem({

    id: "farms",

    titleKey: "menu.farms",

    path: "/farms",

    icon: "farm",

    module: "farms"

  }),



  createMenuItem({

    id: "fields",

    titleKey: "menu.fields",

    path: "/fields",

    icon: "field",

    module: "fields"

  }),



  createMenuItem({

    id: "crops",

    titleKey: "menu.crops",

    path: "/crops",

    icon: "crop",

    module: "crops"

  }),



  createMenuItem({

    id: "irrigation",

    titleKey: "menu.irrigation",

    path: "/irrigation",

    icon: "water",

    module: "irrigation"

  }),



  createMenuItem({

    id: "fertilizers",

    titleKey: "menu.fertilizers",

    path: "/fertilizers",

    icon: "fertilizer",

    module: "fertilizers"

  }),



  createMenuItem({

    id: "pesticides",

    titleKey: "menu.pesticides",

    path: "/pesticides",

    icon: "pesticide",

    module: "pesticides"

  }),



  createMenuItem({

    id: "diseases",

    titleKey: "menu.diseases",

    path: "/diseases",

    icon: "disease",

    module: "diseases"

  }),



  createMenuItem({

    id: "weather",

    titleKey: "menu.weather",

    path: "/weather",

    icon: "weather",

    module: "weather"

  }),



  createMenuItem({

    id: "map",

    titleKey: "menu.map",

    path: "/map",

    icon: "map",

    module: "map"

  }),



  createMenuItem({

    id: "ai",

    titleKey: "menu.ai",

    path: "/ai",

    icon: "ai",

    module: "ai"

  }),



  createMenuItem({

    id: "engineer",

    titleKey: "menu.engineer",

    path: "/engineer",

    icon: "engineer",

    module: "engineer"

  }),



  createMenuItem({

    id: "reports",

    titleKey: "menu.reports",

    path: "/reports",

    icon: "reports",

    module: "reports"

  }),



  createMenuItem({

    id: "harvest",

    titleKey: "menu.harvest",

    path: "/harvest",

    icon: "harvest",

    module: "harvest"

  }),



  createMenuItem({

    id: "inventory",

    titleKey: "menu.inventory",

    path: "/inventory",

    icon: "inventory",

    module: "inventory"

  }),



  createMenuItem({

    id: "expenses",

    titleKey: "menu.expenses",

    path: "/expenses",

    icon: "expenses",

    module: "expenses"

  }),



  createMenuItem({

    id: "settings",

    titleKey: "menu.settings",

    path: "/settings",

    icon: "settings",

    module: "settings"

  })


]);



export default menuConfig;
