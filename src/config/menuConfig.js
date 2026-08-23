// src/config/menuConfig.js

const createMenuItem = ({
  id,
  titleKey,
  path,
  icon,
  module,
  permission = null,
  enabled = true,
}) =>
  Object.freeze({
    id,
    titleKey,
    path,
    icon,
    module,
    permission,
    enabled,
  });

const menuConfig = Object.freeze([
  createMenuItem({
    id: "dashboard",
    titleKey: "menu.dashboard",
    path: "/dashboard",
    icon: "📊",
    module: "dashboard",
  }),

  createMenuItem({
    id: "farms",
    titleKey: "menu.farms",
    path: "/farms",
    icon: "🚜",
    module: "farms",
  }),

  createMenuItem({
    id: "fields",
    titleKey: "menu.fields",
    path: "/fields",
    icon: "🌱",
    module: "fields",
  }),

  createMenuItem({
    id: "crops",
    titleKey: "menu.crops",
    path: "/crops",
    icon: "🌾",
    module: "crops",
  }),

  createMenuItem({
    id: "irrigation",
    titleKey: "menu.irrigation",
    path: "/irrigation",
    icon: "💧",
    module: "irrigation",
  }),

  createMenuItem({
    id: "fertilizers",
    titleKey: "menu.fertilizers",
    path: "/fertilizers",
    icon: "🧪",
    module: "fertilizers",
  }),

  createMenuItem({
    id: "pesticides",
    titleKey: "menu.pesticides",
    path: "/pesticides",
    icon: "🛡️",
    module: "pesticides",
  }),

  createMenuItem({
    id: "diseases",
    titleKey: "menu.diseases",
    path: "/diseases",
    icon: "🦠",
    module: "diseases",
  }),

  createMenuItem({
    id: "weather",
    titleKey: "menu.weather",
    path: "/weather",
    icon: "☁️",
    module: "weather",
  }),

  createMenuItem({
    id: "map",
    titleKey: "menu.map",
    path: "/map",
    icon: "🗺️",
    module: "map",
  }),

  createMenuItem({
    id: "ai",
    titleKey: "menu.ai",
    path: "/ai",
    icon: "🤖",
    module: "ai",
  }),

  createMenuItem({
    id: "engineer",
    titleKey: "menu.engineer",
    path: "/engineer",
    icon: "👨‍🌾",
    module: "engineer",
  }),

  createMenuItem({
    id: "reports",
    titleKey: "menu.reports",
    path: "/reports",
    icon: "📈",
    module: "reports",
  }),

  createMenuItem({
    id: "harvest",
    titleKey: "menu.harvest",
    path: "/harvest",
    icon: "🌽",
    module: "harvest",
  }),

  createMenuItem({
    id: "inventory",
    titleKey: "menu.inventory",
    path: "/inventory",
    icon: "📦",
    module: "inventory",
  }),

  createMenuItem({
    id: "expenses",
    titleKey: "menu.expenses",
    path: "/expenses",
    icon: "💰",
    module: "expenses",
  }),

  createMenuItem({
    id: "users",
    titleKey: "menu.users",
    path: "/users",
    icon: "👥",
    module: "users",
  }),

  createMenuItem({
    id: "settings",
    titleKey: "menu.settings",
    path: "/settings",
    icon: "⚙️",
    module: "settings",
  }),
]);

export default menuConfig;
