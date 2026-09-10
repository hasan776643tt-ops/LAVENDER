// =========================================================
// LAVENDER — NEW AGRICULTURAL PROJECT
// src/pages/NewFarm.jsx
// =========================================================

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";
import useMap from "../hooks/useMap.js";


// =========================================================
// CONSTANTS
// =========================================================

const DRAFT_STORAGE_KEY =
  "lavender:newFarmDraft";


// =========================================================
// EMPTY DRAFT
// =========================================================

function createEmptyDraft() {
  return {
    farmId: "",
    farmName: "",
    projectName: "",
    plantType: "",
    seedType: "",
    country: "",
    governorate: "",
    city: "",
    village: "",
    plantingDate: "",
    seedQuantity: "",
    fertilizerQuantity: "",
  };
}


// =========================================================
// DRAFT STORAGE
// =========================================================

function readDraft() {
  try {
    const raw =
      window.sessionStorage.getItem(
        DRAFT_STORAGE_KEY
      );

    if (!raw) {
      return createEmptyDraft();
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return createEmptyDraft();
    }

    return {
      ...createEmptyDraft(),
      ...parsed,
    };
  } catch (error) {
    console.error(
      "Failed to read new farm draft:",
      error
    );

    return createEmptyDraft();
  }
}


function saveDraft(draft) {
  try {
    window.sessionStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(draft)
    );
  } catch (error) {
    console.error(
      "Failed to save new farm draft:",
      error
    );
  }
}


function clearDraft() {
  try {
    window.sessionStorage.removeItem(
      DRAFT_STORAGE_KEY
    );
  } catch (error) {
    console.error(
      "Failed to clear new farm draft:",
      error
    );
  }
}


// =========================================================
// SAFE STRING
// =========================================================

function cleanDraftValue(value) {
  return String(
    value ?? ""
  ).trim();
}


// =========================================================
// ARABIC DIGITS
// =========================================================

function convertArabicDigits(value) {
  return String(value ?? "")
    .replace(/[٠-٩]/g, digit =>
      String(
        "٠١٢٣٤٥٦٧٨٩".indexOf(
          digit
        )
      )
    )
    .replace(/[۰-۹]/g, digit =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".indexOf(
          digit
        )
      )
    );
}


// =========================================================
// MANUAL DATE PARSER
// =========================================================

function parseManualDate(value) {
  if (!value) {
    return null;
  }

  const normalized =
    convertArabicDigits(
      String(value)
    )
      .trim()
      .replace(/[،,./-]+/g, " ")
      .replace(/\s+/g, " ");

  const parts =
    normalized
      .split(" ")
      .filter(Boolean);

  if (parts.length !== 3) {
    return null;
  }

  const day =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const year =
    Number(parts[2]);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return null;
  }

  if (
    year < 1900 ||
    year > 2200 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}


// =========================================================
// PLANT AGE
// =========================================================

function calculatePlantAge(
  plantingDate
) {
  const start =
    parseManualDate(
      plantingDate
    );

  if (!start) {
    return "";
  }

  const today =
    new Date();

  const current =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  if (start > current) {
    return "لم تبدأ الزراعة بعد";
  }

  let years =
    current.getFullYear() -
    start.getFullYear();

  let months =
    current.getMonth() -
    start.getMonth();

  let days =
    current.getDate() -
    start.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth =
      new Date(
        current.getFullYear(),
        current.getMonth(),
        0
      );

    days +=
      previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];

  if (years > 0) {
    parts.push(
      `${years} سنة`
    );
  }

  if (months > 0) {
    parts.push(
      `${months} شهر`
    );
  }

  if (
    days > 0 ||
    parts.length === 0
  ) {
    parts.push(
      `${days} يوم`
    );
  }

  return parts.join(
    " و "
  );
}


// =========================================================
// NUMBER
// =========================================================

function normalizeNumber(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : 0;
}


// =========================================================
// CLIMATE
// =========================================================

function estimateClimate({
  country,
  governorate,
  city,
  village,
  latitude,
}) {
  const lat =
    Number(latitude);

  if (
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90
  ) {
    if (lat >= 50) {
      return {
        text: "مناخ بارد",
        ready: true,
      };
    }

    if (lat >= 25) {
      return {
        text: "مناخ معتدل",
        ready: true,
      };
    }

    return {
      text: "مناخ حار",
      ready: true,
    };
  }

  const hasAdministrativeInfo =
    Boolean(
      String(country || "").trim() ||
      String(governorate || "").trim() ||
      String(city || "").trim() ||
      String(village || "").trim()
    );

  if (!hasAdministrativeInfo) {
    return {
      text: "",
      ready: false,
    };
  }

  const text =
    `${country || ""} ${
      governorate || ""
    } ${
      city || ""
    } ${
      village || ""
    }`.toLowerCase();

  if (
    text.includes("سوريا") ||
    text.includes("syria")
  ) {
    return {
      text: "مناخ متنوع حسب المنطقة",
      ready: true,
    };
  }

  return {
    text: "مناخ تقديري حسب الموقع",
    ready: true,
  };
}


// =========================================================
// RECOMMENDATIONS
// =========================================================

function estimateRecommendedSeeds({
  climateReady,
  plantType,
  seedType,
}) {
  if (!climateReady) {
    return [];
  }

  const plant =
    String(
      plantType || ""
    ).trim();

  const seed =
    String(
      seedType || ""
    ).trim();

  if (!plant && !seed) {
    return [];
  }

  const combined =
    `${plant} ${seed}`;

  if (
    combined.includes("قمح")
  ) {
    return [
      "شام 6",
      "شام 8",
      "أصناف قمح متوسطة الموسم",
    ];
  }

  if (
    combined.includes("شعير")
  ) {
    return [
      "شعير محلي متأقلم",
      "أصناف شعير مبكرة",
    ];
  }

  if (
    combined.includes("عدس")
  ) {
    return [
      "أصناف عدس متأقلمة مع المنطقة",
      "أصناف مبكرة النضج",
    ];
  }

  if (
    combined.includes("حمص")
  ) {
    return [
      "أصناف حمص متحملة للجفاف",
      "أصناف مبكرة النضج",
    ];
  }

  return [
    "اختر بذارًا متأقلمًا مع مناخ وموقع الحقل",
    "يفضل اختيار صنف معتمد ومناسب للمنطقة",
  ];
}


// =========================================================
// FARM ID
// =========================================================

function getFarmId(farm) {
  return (
    farm?.id ??
    farm?._id ??
    farm?.farmId ??
    farm?.farm_id ??
    ""
  );
}


// =========================================================
// LOCATION FARM ID
// =========================================================

function getLocationFarmId(
  location
) {
  return (
    location?.farmId ??
    location?.farmID ??
    location?.farm_id ??
    location?.farm_id_value ??
    location?.farm?.id ??
    location?.farm?._id ??
    location?.farm?.farmId ??
    location?.farm?.farm_id ??
    ""
  );
}


// =========================================================
// LOCATION SOURCES
// =========================================================

function getLocationSources(
  location
) {
  if (
    !location ||
    typeof location !== "object"
  ) {
    return [];
  }

  const sources = [
    location,
    location.address,
    location.administrative,
    location.reverseGeocode,
    location.reverse_geocode,
    location.geocoding,
    location.location,
    location.geo,
    location.properties,
    location.properties?.address,
    location.properties?.administrative,
    location.result,
    location.result?.address,
  ];

  return sources.filter(
    source =>
      source &&
      typeof source === "object"
  );
}


// =========================================================
// LOCATION VALUE
// =========================================================

function getLocationValue(
  location,
  keys
) {
  const sources =
    getLocationSources(
      location
    );

  for (
    const source of sources
  ) {
    for (
      const key of keys
    ) {
      const value =
        source?.[key];

      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        return String(
          value
        ).trim();
      }
    }
  }

  return "";
}


// =========================================================
// NORMALIZE ADMINISTRATIVE LOCATION
// =========================================================

function normalizeAdministrativeLocation(
  location
) {
  return {
    country:
      getLocationValue(
        location,
        [
          "country",
          "countryName",
          "country_name",
        ]
      ),

    governorate:
      getLocationValue(
        location,
        [
          "governorate",
          "governorateName",
          "governorate_name",
          "province",
          "provinceName",
          "province_name",
          "region",
          "regionName",
          "region_name",
          "state",
          "stateName",
          "state_name",
          "state_district",
          "stateDistrict",
          "county",
          "countyName",
          "district",
          "districtName",
        ]
      ),

    city:
      getLocationValue(
        location,
        [
          "city",
          "cityName",
          "city_name",
          "municipality",
          "municipalityName",
          "municipality_name",
          "city_district",
          "cityDistrict",
          "locality",
          "localityName",
          "locality_name",
        ]
      ),

    village:
      getLocationValue(
        location,
        [
          "village",
          "villageName",
          "village_name",
          "town",
          "townName",
          "town_name",
          "suburb",
          "suburbName",
          "suburb_name",
          "hamlet",
          "hamletName",
          "hamlet_name",
          "locality",
          "localityName",
          "neighbourhood",
          "neighborhood",
          "placeName",
          "place_name",
          "place",
        ]
      ),
  };
}


// =========================================================
// MERGE ADMINISTRATIVE LOCATION
// =========================================================

function mergeAdministrativeLocation(
  ...locationsToMerge
) {
  const result = {
    country: "",
    governorate: "",
    city: "",
    village: "",
  };

  for (
    const location of locationsToMerge
  ) {
    const normalized =
      normalizeAdministrativeLocation(
        location
      );

    if (
      !result.country &&
      normalized.country
    ) {
      result.country =
        normalized.country;
    }

    if (
      !result.governorate &&
      normalized.governorate
    ) {
      result.governorate =
        normalized.governorate;
    }

    if (
      !result.city &&
      normalized.city
    ) {
      result.city =
        normalized.city;
    }

    if (
      !result.village &&
      normalized.village
    ) {
      result.village =
        normalized.village;
    }
  }

  return result;
}


// =========================================================
// NORMALIZE MAP POINT
// =========================================================

function normalizeMapPoint(
  point
) {
  if (!point) {
    return null;
  }

  if (
    Array.isArray(point)
  ) {
    const latitude =
      Number(point[0]);

    const longitude =
      Number(point[1]);

    if (
      !Number.isFinite(
        latitude
      ) ||
      !Number.isFinite(
        longitude
      )
    ) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  }

  const latitude =
    point?.latitude ??
    point?.lat ??
    point?.y;

  const longitude =
    point?.longitude ??
    point?.lng ??
    point?.lon ??
    point?.x;

  const lat =
    Number(latitude);

  const lng =
    Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  return {
    latitude: lat,
    longitude: lng,
  };
}


// =========================================================
// NORMALIZE LOCATION POINTS
// =========================================================

function normalizeLocationPoints(
  location
) {
  if (!location) {
    return [];
  }

  let rawPoints = [];

  if (
    Array.isArray(
      location?.boundary
    )
  ) {
    rawPoints =
      location.boundary;
  } else if (
    Array.isArray(
      location?.points
    )
  ) {
    rawPoints =
      location.points;
  } else if (
    Array.isArray(
      location?.coordinates
    )
  ) {
    rawPoints =
      location.coordinates;
  } else if (
    Array.isArray(
      location?.geometry?.coordinates
    )
  ) {
    rawPoints =
      location.geometry.coordinates;
  }

  return rawPoints
    .map(
      normalizeMapPoint
    )
    .filter(Boolean);
}


// =========================================================
// LOCATION CENTER
// =========================================================

function getLocationCenter(
  location
) {
  if (!location) {
    return null;
  }

  const directLatitude =
    Number(
      location?.latitude ??
      location?.lat ??
      location?.center?.latitude ??
      location?.center?.lat
    );

  const directLongitude =
    Number(
      location?.longitude ??
      location?.lng ??
      location?.lon ??
      location?.center?.longitude ??
      location?.center?.lng
    );

  if (
    Number.isFinite(
      directLatitude
    ) &&
    Number.isFinite(
      directLongitude
    )
  ) {
    return {
      latitude:
        directLatitude,

      longitude:
        directLongitude,
    };
  }

  const points =
    normalizeLocationPoints(
      location
    );

  if (!points.length) {
    return null;
  }

  const latitude =
    points.reduce(
      (
        sum,
        point
      ) =>
        sum +
        point.latitude,
      0
    ) /
    points.length;

  const longitude =
    points.reduce(
      (
        sum,
        point
      ) =>
        sum +
        point.longitude,
      0
    ) /
    points.length;

  return {
    latitude,
    longitude,
  };
}


// =========================================================
// COMPONENT
// =========================================================

export default function NewFarm() {
  const navigate =
    useNavigate();

  const routeLocation =
    useLocation();

  const [
    searchParams,
  ] = useSearchParams();

  const {
    addFarm,
  } = useFarms();

  const {
    addCrop,
  } = useCrops();

  const map =
    useMap();

  // =======================================================
  // MAP DATA
  // =======================================================

  const mapFarmId =
    map?.farmId ?? "";

  const latitude =
    map?.latitude;

  const longitude =
    map?.longitude;

  const points =
    Array.isArray(
      map?.points
    )
      ? map.points
      : [];

  const boundary =
    Array.isArray(
      map?.boundary
    )
      ? map.boundary
      : [];

  const country =
    map?.country ?? "";

  const governorate =
    map?.governorate ??
    map?.province ??
    map?.region ??
    "";

  const city =
    map?.city ?? "";

  const village =
    map?.village ??
    map?.town ??
    map?.placeName ??
    "";

  const mapLoading =
    Boolean(
      map?.loading ||
      map?.mapLoading
    );

  const locations =
    Array.isArray(
      map?.locations
    )
      ? map.locations
      : [];

  const administrative =
    map?.administrative ?? null;

  const loadFarmLocation =
    typeof map?.loadFarmLocation ===
    "function"
      ? map.loadFarmLocation
      : null;

  const reverseGeocode =
    typeof map?.reverseGeocode ===
    "function"
      ? map.reverseGeocode
      : null;

  const setMapFarmId =
    typeof map?.setFarmId ===
    "function"
      ? map.setFarmId
      : null;

  // =======================================================
  // LOCAL LOADED LOCATION
  //
  // مهم:
  // Map و NewFarm يملكان نسختين منفصلتين من useMap.
  // لذلك نحفظ نتيجة loadFarmLocation محليًا.
  // =======================================================

  const [
    loadedLocation,
    setLoadedLocation,
  ] = useState(null);

  // =======================================================
  // DRAFT
  // =======================================================

  const [
    draft,
    setDraft,
  ] = useState(
    () =>
      readDraft()
  );

  const [
    savingFarm,
    setSavingFarm,
  ] = useState(false);

  const [
    savingCrop,
    setSavingCrop,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const geocodeKeyRef =
    useRef("");

  // =======================================================
  // URL
  // =======================================================

  const urlFarmId =
    searchParams.get(
      "farmId"
    );

  // =======================================================
  // SELECTED FARM ID
  // =======================================================

  const selectedFarmId =
    draft.farmId ||
    urlFarmId ||
    mapFarmId ||
    "";

  // =======================================================
  // FIND SAVED LOCATION
  // =======================================================

  const savedLocation =
    useMemo(
      () => {
        if (
          !selectedFarmId
        ) {
          return null;
        }

        const matches =
          locations.filter(
            location =>
              String(
                getLocationFarmId(
                  location
                )
              ) ===
              String(
                selectedFarmId
              )
          );

        if (
          !matches.length
        ) {
          return null;
        }

        return matches[
          matches.length - 1
        ];
      },
      [
        locations,
        selectedFarmId,
      ]
    );

  // =======================================================
  // EFFECTIVE SAVED LOCATION
  //
  // نعطي الأولوية للموقع الذي تم تحميله مباشرة من repository.
  // =======================================================

  const effectiveSavedLocation =
    loadedLocation ||
    savedLocation;

  // =======================================================
  // HOOK ADMINISTRATIVE DATA
  // =======================================================

  const hookAdministrativeLocation =
    useMemo(
      () =>
        mergeAdministrativeLocation(
          administrative
        ),
      [
        administrative,
      ]
    );

  // =======================================================
  // LOADED ADMINISTRATIVE DATA
  // =======================================================

  const loadedAdministrativeLocation =
    useMemo(
      () =>
        mergeAdministrativeLocation(
          effectiveSavedLocation,
          loadedLocation
        ),
      [
        effectiveSavedLocation,
        loadedLocation,
      ]
    );

  // =======================================================
  // SAVED LOCATION POINTS
  // =======================================================

  const savedLocationPoints =
    useMemo(
      () =>
        normalizeLocationPoints(
          effectiveSavedLocation
        ),
      [
        effectiveSavedLocation,
      ]
    );

  // =======================================================
  // SAVED LOCATION CENTER
  // =======================================================

  const savedLocationCenter =
    useMemo(
      () =>
        getLocationCenter(
          effectiveSavedLocation
        ),
      [
        effectiveSavedLocation,
      ]
    );

  // =======================================================
  // EFFECTIVE COORDINATES
  // =======================================================

  const numericLatitude =
    Number(latitude);

  const numericLongitude =
    Number(longitude);

  const effectiveLatitude =
    savedLocationCenter?.latitude ??
    (
      Number.isFinite(
        numericLatitude
      )
        ? numericLatitude
        : ""
    );

  const effectiveLongitude =
    savedLocationCenter?.longitude ??
    (
      Number.isFinite(
        numericLongitude
      )
        ? numericLongitude
        : ""
    );

  // =======================================================
  // EFFECTIVE BOUNDARY
  // =======================================================

  const currentBoundary =
    savedLocationPoints.length >= 3
      ? savedLocationPoints
      : boundary.length >= 3
        ? boundary
        : points;

  const locationPointCount =
    currentBoundary.length;

  const hasLocation =
    Number.isFinite(
      Number(
        effectiveLatitude
      )
    ) &&
    Number.isFinite(
      Number(
        effectiveLongitude
      )
    ) &&
    currentBoundary.length >= 3;

  // =======================================================
  // ADMINISTRATIVE LOCATION
  // =======================================================

  const locationAdministrative =
    useMemo(
      () =>
        mergeAdministrativeLocation(
          effectiveSavedLocation,
          loadedLocation,
          administrative,
          {
            country,
            governorate,
            city,
            village,
          },
          draft
        ),
      [
        effectiveSavedLocation,
        loadedLocation,
        administrative,
        country,
        governorate,
        city,
        village,
        draft.country,
        draft.governorate,
        draft.city,
        draft.village,
      ]
    );

  const locationCountry =
    cleanDraftValue(
      locationAdministrative.country
    );

  const locationGovernorate =
    cleanDraftValue(
      locationAdministrative.governorate
    );

  const locationCity =
    cleanDraftValue(
      locationAdministrative.city
    );

  const locationVillage =
    cleanDraftValue(
      locationAdministrative.village
    );

  // =======================================================
  // LOAD FARM LOCATION DIRECTLY
  //
  // عند الرجوع من Map:
  // نعيد تحميل الموقع من المصدر الحقيقي بواسطة farmId.
  // =======================================================

  useEffect(
    () => {
      if (
        !selectedFarmId ||
        !loadFarmLocation
      ) {
        return;
      }

      let active = true;

      const farmId =
        String(
          selectedFarmId
        );

      const load =
        async () => {
          try {
            const loaded =
              await loadFarmLocation(
                farmId
              );

            if (
              !active
            ) {
              return;
            }

            if (
              loaded
            ) {
              setLoadedLocation(
                loaded
              );

              const admin =
                mergeAdministrativeLocation(
                  loaded
                );

              if (
                admin.country ||
                admin.governorate ||
                admin.city ||
                admin.village
              ) {
                setDraft(
                  previous => {
                    const next = {
                      ...previous,

                      farmId:
                        previous.farmId ||
                        farmId,

                      country:
                        admin.country ||
                        previous.country ||
                        "",

                      governorate:
                        admin.governorate ||
                        previous.governorate ||
                        "",

                      city:
                        admin.city ||
                        previous.city ||
                        "",

                      village:
                        admin.village ||
                        previous.village ||
                        "",
                    };

                    saveDraft(
                      next
                    );

                    return next;
                  }
                );
              }
            }
          } catch (loadError) {
            console.warn(
              "NewFarm location reload failed:",
              loadError
            );
          }
        };

      load();

      return () => {
        active = false;
      };
    },
    [
      selectedFarmId,
      loadFarmLocation,
      routeLocation.key,
    ]
  );

  // =======================================================
  // FALLBACK REVERSE GEOCODING
  // =======================================================

  useEffect(
    () => {
      if (
        !selectedFarmId ||
        !reverseGeocode
      ) {
        return;
      }

      const lat =
        Number(
          effectiveLatitude
        );

      const lng =
        Number(
          effectiveLongitude
        );

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      const hasAdministrative =
        Boolean(
          locationCountry ||
          locationGovernorate ||
          locationCity ||
          locationVillage
        );

      if (
        hasAdministrative
      ) {
        return;
      }

      const key =
        `${selectedFarmId}:${lat.toFixed(
          7
        )}:${lng.toFixed(
          7
        )}`;

      if (
        geocodeKeyRef.current ===
        key
      ) {
        return;
      }

      geocodeKeyRef.current =
        key;

      let active = true;

      const geocode =
        async () => {
          try {
            const result =
              await reverseGeocode(
                lat,
                lng
              );

            if (
              !active ||
              !result
            ) {
              return;
            }

            const admin =
              mergeAdministrativeLocation(
                result
              );

            if (
              !admin.country &&
              !admin.governorate &&
              !admin.city &&
              !admin.village
            ) {
              return;
            }

            setLoadedLocation(
              previous => ({
                ...(previous || {}),
                ...result,
              })
            );

            setDraft(
              previous => {
                const next = {
                  ...previous,

                  farmId:
                    previous.farmId ||
                    String(
                      selectedFarmId
                    ),

                  country:
                    admin.country ||
                    previous.country ||
                    "",

                  governorate:
                    admin.governorate ||
                    previous.governorate ||
                    "",

                  city:
                    admin.city ||
                    previous.city ||
                    "",

                  village:
                    admin.village ||
                    previous.village ||
                    "",
                };

                saveDraft(
                  next
                );

                return next;
              }
            );
          } catch (geocodeError) {
            console.warn(
              "NewFarm reverse geocoding failed:",
              geocodeError
            );
          }
        };

      geocode();

      return () => {
        active = false;
      };
    },
    [
      selectedFarmId,
      effectiveLatitude,
      effectiveLongitude,
      locationCountry,
      locationGovernorate,
      locationCity,
      locationVillage,
      reverseGeocode,
    ]
  );

  // =======================================================
  // SYNC LOCATION → DRAFT
  // =======================================================

  useEffect(
    () => {
      if (
        !selectedFarmId
      ) {
        return;
      }

      if (
        !locationCountry &&
        !locationGovernorate &&
        !locationCity &&
        !locationVillage
      ) {
        return;
      }

      setDraft(
        previous => {
          const next = {
            ...previous,

            farmId:
              previous.farmId ||
              String(
                selectedFarmId
              ),

            country:
              locationCountry ||
              previous.country ||
              "",

            governorate:
              locationGovernorate ||
              previous.governorate ||
              "",

            city:
              locationCity ||
              previous.city ||
              "",

            village:
              locationVillage ||
              previous.village ||
              "",
          };

          const changed =
            next.country !==
              previous.country ||
            next.governorate !==
              previous.governorate ||
            next.city !==
              previous.city ||
            next.village !==
              previous.village ||
            next.farmId !==
              previous.farmId;

          if (!changed) {
            return previous;
          }

          saveDraft(
            next
          );

          return next;
        }
      );
    },
    [
      selectedFarmId,
      locationCountry,
      locationGovernorate,
      locationCity,
      locationVillage,
    ]
  );

  // =======================================================
  // KEEP MAP FARM ID IN SYNC
  // =======================================================

  useEffect(
    () => {
      if (
        !selectedFarmId ||
        !setMapFarmId
      ) {
        return;
      }

      if (
        String(
          mapFarmId
        ) !==
        String(
          selectedFarmId
        )
      ) {
        setMapFarmId(
          String(
            selectedFarmId
          )
        );
      }
    },
    [
      selectedFarmId,
      mapFarmId,
      setMapFarmId,
    ]
  );

  // =======================================================
  // URL FARM ID → DRAFT
  // =======================================================

  useEffect(
    () => {
      if (
        !urlFarmId
      ) {
        return;
      }

      const normalizedId =
        String(
          urlFarmId
        );

      setDraft(
        previous => {
          if (
            String(
              previous.farmId
            ) ===
            normalizedId
          ) {
            return previous;
          }

          const next = {
            ...previous,
            farmId:
              normalizedId,
          };

          saveDraft(
            next
          );

          return next;
        }
      );
    },
    [
      urlFarmId,
    ]
  );

  // =======================================================
  // AUTO SAVE DRAFT
  // =======================================================

  useEffect(
    () => {
      saveDraft(
        draft
      );
    },
    [
      draft,
    ]
  );

  // =======================================================
  // CLIMATE
  // =======================================================

  const climate =
    useMemo(
      () =>
        estimateClimate({
          country:
            locationCountry,

          governorate:
            locationGovernorate,

          city:
            locationCity,

          village:
            locationVillage,

          latitude:
            effectiveLatitude,
        }),
      [
        locationCountry,
        locationGovernorate,
        locationCity,
        locationVillage,
        effectiveLatitude,
      ]
    );

  // =======================================================
  // RECOMMENDATIONS
  // =======================================================

  const recommendedSeeds =
    useMemo(
      () =>
        estimateRecommendedSeeds({
          climateReady:
            climate.ready,

          plantType:
            draft.plantType,

          seedType:
            draft.seedType,
        }),
      [
        climate.ready,
        draft.plantType,
        draft.seedType,
      ]
    );

  // =======================================================
  // PLANT AGE
  // =======================================================

  const plantAge =
    useMemo(
      () =>
        calculatePlantAge(
          draft.plantingDate
        ),
      [
        draft.plantingDate,
      ]
    );

  // =======================================================
  // UPDATE FIELD
  // =======================================================

  const updateField = (
    field,
    value
  ) => {
    setError("");
    setSuccess("");

    setDraft(
      previous => ({
        ...previous,
        [field]:
          value,
      })
    );
  };

  // =======================================================
  // OPEN MAP
  // =======================================================

  const openMap = async () => {
    setError("");
    setSuccess("");

    const farmName =
      String(
        draft.farmName || ""
      ).trim();

    if (!farmName) {
      setError(
        "أدخل اسم المزرعة الجديدة أولًا."
      );
      return;
    }

    if (
      !String(
        draft.projectName || ""
      ).trim()
    ) {
      setError(
        "أدخل اسم المشروع الزراعي أولًا."
      );
      return;
    }

    if (
      !String(
        draft.plantType || ""
      ).trim()
    ) {
      setError(
        "أدخل نوع النبات المزروع أولًا."
      );
      return;
    }

    if (
      !String(
        draft.seedType || ""
      ).trim()
    ) {
      setError(
        "أدخل نوع البذار المختار أولًا."
      );
      return;
    }

    if (
      selectedFarmId
    ) {
      if (
        setMapFarmId
      ) {
        setMapFarmId(
          String(
            selectedFarmId
          )
        );
      }

      navigate(
        `/map?farmId=${encodeURIComponent(
          String(
            selectedFarmId
          )
        )}&return=new-farm&farmName=${encodeURIComponent(
          farmName
        )}`
      );

      return;
    }

    setSavingFarm(
      true
    );

    try {
      const createdFarm =
        await addFarm({
          name:
            farmName,

          farmName:
            farmName,

          status:
            "active",
        });

      const createdFarmId =
        getFarmId(
          createdFarm
        );

      if (
        !createdFarmId
      ) {
        throw new Error(
          "Farm was created without an ID."
        );
      }

      const normalizedId =
        String(
          createdFarmId
        );

      const nextDraft = {
        ...draft,

        farmId:
          normalizedId,

        farmName:
          farmName,
      };

      setDraft(
        nextDraft
      );

      saveDraft(
        nextDraft
      );

      if (
        setMapFarmId
      ) {
        setMapFarmId(
          normalizedId
        );
      }

      navigate(
        `/map?farmId=${encodeURIComponent(
          normalizedId
        )}&return=new-farm&farmName=${encodeURIComponent(
          farmName
        )}`
      );
    } catch (err) {
      console.error(
        "Failed to create new farm:",
        err
      );

      setError(
        "تعذر إنشاء المزرعة الجديدة. حاول مرة أخرى."
      );
    } finally {
      setSavingFarm(
        false
      );
    }
  };

  // =======================================================
  // SAVE FARM + PROJECT
  // =======================================================

  const saveFarm = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const currentFarmId =
      draft.farmId ||
      urlFarmId ||
      mapFarmId ||
      "";

    if (
      !currentFarmId
    ) {
      setError(
        "أدخل اسم المزرعة الجديدة وحدد موقعها من الخريطة أولًا."
      );
      return;
    }

    if (
      !draft.farmName.trim()
    ) {
      setError(
        "أدخل اسم المزرعة الجديدة."
      );
      return;
    }

    if (
      !draft.projectName.trim()
    ) {
      setError(
        "أدخل اسم المشروع الزراعي."
      );
      return;
    }

    if (
      !draft.plantType.trim()
    ) {
      setError(
        "أدخل نوع النبات المزروع."
      );
      return;
    }

    if (
      !draft.seedType.trim()
    ) {
      setError(
        "أدخل نوع البذار المختار."
      );
      return;
    }

    const finalPoints =
      savedLocationPoints.length >= 3
        ? savedLocationPoints
        : boundary.length >= 3
          ? boundary
          : points;

    const finalLatitude =
      Number(
        effectiveLatitude
      );

    const finalLongitude =
      Number(
        effectiveLongitude
      );

    if (
      !Number.isFinite(
        finalLatitude
      ) ||
      !Number.isFinite(
        finalLongitude
      )
    ) {
      setError(
        "يجب تحديد موقع الحقل يدويًا من الخريطة أولًا."
      );
      return;
    }

    if (
      finalPoints.length < 3
    ) {
      setError(
        "يجب تحديد 3 نقاط حدود على الأقل في الخريطة."
      );
      return;
    }

    if (
      !draft.plantingDate.trim()
    ) {
      setError(
        "أدخل تاريخ الزراعة."
      );
      return;
    }

    if (
      !parseManualDate(
        draft.plantingDate
      )
    ) {
      setError(
        "صيغة تاريخ الزراعة غير صحيحة. مثال: 2,6,2026 أو 15.5.2024."
      );
      return;
    }

    setSavingCrop(
      true
    );

    try {
      const normalizedFarmId =
        String(
          currentFarmId
        );

      const projectName =
        draft.projectName.trim();

      const plantType =
        draft.plantType.trim();

      const seedType =
        draft.seedType.trim();

      const plantingDate =
        draft.plantingDate.trim();

      await addCrop({
        farmId:
          normalizedFarmId,

        cultivationType:
          "field",

        name:
          plantType,

        projectName:
          projectName,

        plantType:
          plantType,

        seedType:
          seedType,

        seedVariety:
          "",

        seedQuality:
          "",

        seedQuantity:
          normalizeNumber(
            draft.seedQuantity
          ),

        treeType:
          "",

        treeVariety:
          "",

        plantingDate:
          plantingDate,

        fertilizerType:
          "",

        fertilizerQuantity:
          normalizeNumber(
            draft.fertilizerQuantity
          ),

        harvestDate:
          "",

        expectedProduction:
          0,

        actualProduction:
          0,

        salePrice:
          0,

        revenue:
          0,

        netProfit:
          0,

        latitude:
          finalLatitude,

        longitude:
          finalLongitude,

        boundary:
          finalPoints,

        points:
          finalPoints,

        country:
          locationCountry,

        governorate:
          locationGovernorate,

        city:
          locationCity,

        village:
          locationVillage,

        climate:
          climate.text,

        recommendedSeeds:
          recommendedSeeds,

        notes:
          "",

        status:
          "active",
      });

      clearDraft();

      setSuccess(
        "تم حفظ المزرعة والمشروع الزراعي بنجاح."
      );

      setTimeout(
        () => {
          navigate(
            "/farms",
            {
              replace:
                true,
            }
          );
        },
        700
      );
    } catch (err) {
      console.error(
        "Failed to save agricultural project:",
        err
      );

      setError(
        "تعذر حفظ المشروع الزراعي. حاول مرة أخرى."
      );
    } finally {
      setSavingCrop(
        false
      );
    }
  };

  // =======================================================
  // CANCEL
  // =======================================================

  const cancel = () => {
    clearDraft();

    navigate(
      "/farms"
    );
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main
      className="farms-selector"
      dir="rtl"
      style={{
        fontSize:
          "21px",
      }}
    >
      <div
        className="farms-page-content"
        style={{
          padding:
            "28px 16px 38px",
        }}
      >
        <form
          onSubmit={
            saveFarm
          }
          className="new-farm-form"
          style={{
            width:
              "100%",

            maxWidth:
              "680px",

            margin:
              "0 auto",

            display:
              "flex",

            flexDirection:
              "column",

            gap:
              "26px",
          }}
        >
          <header
            style={{
              textAlign:
                "center",

              marginBottom:
                "4px",
            }}
          >
            <h1
              style={{
                margin:
                  "0 0 8px",

                fontSize:
                  "32px",

                fontWeight:
                  900,

                lineHeight:
                  1.4,
              }}
            >
              🌱 مشروعي الزراعي
            </h1>

            <p
              style={{
                margin:
                  0,

                fontSize:
                  "19px",

                fontWeight:
                  700,

                lineHeight:
                  1.6,
              }}
            >
              تسجيل مزرعة جديدة ومشروعها الزراعي
            </p>
          </header>

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2>
              🏡 معلومات المزرعة والمشروع
            </h2>

            <label
              htmlFor="farm-name"
            >
              🏡 اسم المزرعة الجديدة
            </label>

            <input
              id="farm-name"
              type="text"
              value={
                draft.farmName
              }
              onChange={
                event =>
                  updateField(
                    "farmName",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="اكتب اسم المزرعة الجديدة"
              disabled={
                savingFarm ||
                savingCrop
              }
            />

            {draft.farmId && (
              <div
                className="new-farm-readonly"
              >
                🏡 المزرعة الجديدة:{" "}
                <strong>
                  {
                    draft.farmName
                  }
                </strong>
              </div>
            )}

            <label
              htmlFor="project-name"
            >
              🌱 اسم المشروع الزراعي
            </label>

            <input
              id="project-name"
              type="text"
              value={
                draft.projectName
              }
              onChange={
                event =>
                  updateField(
                    "projectName",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="اكتب اسم المشروع الزراعي"
              disabled={
                savingFarm ||
                savingCrop
              }
            />

            <label
              htmlFor="plant-type"
            >
              🌾 نوع النبات المزروع
            </label>

            <input
              id="plant-type"
              type="text"
              value={
                draft.plantType
              }
              onChange={
                event =>
                  updateField(
                    "plantType",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="مثال: قمح"
              disabled={
                savingFarm ||
                savingCrop
              }
            />

            <label
              htmlFor="seed-type"
            >
              🌱 نوع البذار المختار
            </label>

            <input
              id="seed-type"
              type="text"
              value={
                draft.seedType
              }
              onChange={
                event =>
                  updateField(
                    "seedType",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="اكتب نوع أو صنف البذار"
              disabled={
                savingFarm ||
                savingCrop
              }
            />
          </section>

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2>
              🌍 موقع المزرعة والحقل
            </h2>

            <div
              className="new-farm-readonly"
            >
              حدد موقع المزرعة يدويًا من الخريطة.
              يمكن استخدام GPS كمرجع فقط، ولن تتم
              إضافة نقطة تلقائيًا.
            </div>

            <button
              type="button"
              className="farm-map-select-button"
              onClick={
                openMap
              }
              disabled={
                savingFarm ||
                savingCrop ||
                mapLoading
              }
            >
              {savingFarm
                ? "جاري إنشاء المزرعة الجديدة..."
                : mapLoading
                  ? "جاري قراءة الموقع..."
                  : hasLocation
                    ? "🗺️ تعديل موقع المزرعة"
                    : "🗺️ تحديد موقع المزرعة يدويًا من الخريطة"}
            </button>

            <label
              htmlFor="location-country"
            >
              الدولة
            </label>

            <input
              id="location-country"
              type="text"
              value={
                locationCountry
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
            />

            <label
              htmlFor="location-governorate"
            >
              المحافظة
            </label>

            <input
              id="location-governorate"
              type="text"
              value={
                locationGovernorate
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
            />

            <label
              htmlFor="location-city"
            >
              المدينة
            </label>

            <input
              id="location-city"
              type="text"
              value={
                locationCity
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
            />

            <label
              htmlFor="location-village"
            >
              القرية / البلدة
            </label>

            <input
              id="location-village"
              type="text"
              value={
                locationVillage
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
            />

            {hasLocation && (
              <div
                className="new-farm-readonly"
              >
                📍 تم تحديد موقع المزرعة بنجاح
                {locationPointCount > 0
                  ? ` — نقاط الحدود: ${locationPointCount}`
                  : ""}
              </div>
            )}
          </section>

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2>
              🌤️ المناخ والتوصيات
            </h2>

            <label>
              🌤️ المناخ
            </label>

            <div
              className="new-farm-readonly"
            >
              {climate.ready
                ? climate.text
                : "سيظهر تقدير المناخ بعد تحديد الموقع."}
            </div>

            <label>
              💡 التوصيات الزراعية
            </label>

            <div
              className="new-farm-readonly"
            >
              {recommendedSeeds.length > 0
                ? (
                  <ul>
                    {recommendedSeeds.map(
                      (
                        recommendation,
                        index
                      ) => (
                        <li
                          key={
                            `${recommendation}-${index}`
                          }
                        >
                          {recommendation}
                        </li>
                      )
                    )}
                  </ul>
                )
                : "ستظهر التوصيات تلقائيًا بعد توفر الموقع ونوع النبات أو البذار."}
            </div>
          </section>

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2>
              📅 الزراعة وعمر النبات
            </h2>

            <label
              htmlFor="planting-date"
            >
              📅 تاريخ الزراعة
            </label>

            <input
              id="planting-date"
              type="text"
              inputMode="numeric"
              value={
                draft.plantingDate
              }
              onChange={
                event =>
                  updateField(
                    "plantingDate",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="مثال: 2,6,2026 أو 15.5.2024"
              disabled={
                savingFarm ||
                savingCrop
              }
            />

            <div>
              اكتب تاريخ الزراعة بالطريقة التي تناسبك.
              مثال: 2,6,2026 أو 15.5.2024 أو
              15-5-2024 أو 15/5/2024 أو 15 5 2024.
            </div>

            <label>
              ⏳ عمر النبات
            </label>

            <div
              className="new-farm-readonly"
            >
              {plantAge ||
                "سيظهر تلقائيًا عند إمكانية قراءة التاريخ"}
            </div>
          </section>

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2>
              🌱 الكميات المستخدمة
            </h2>

            <label
              htmlFor="seed-quantity"
            >
              🌱 كمية البذار
            </label>

            <input
              id="seed-quantity"
              type="number"
              min="0"
              step="any"
              value={
                draft.seedQuantity
              }
              onChange={
                event =>
                  updateField(
                    "seedQuantity",
                    event.target.value
                  )
              }
              placeholder="الكمية المستخدمة في الحقل"
              disabled={
                savingFarm ||
                savingCrop
              }
            />

            <label
              htmlFor="fertilizer-quantity"
            >
              🧪 كمية السماد
            </label>

            <input
              id="fertilizer-quantity"
              type="number"
              min="0"
              step="any"
              value={
                draft.fertilizerQuantity
              }
              onChange={
                event =>
                  updateField(
                    "fertilizerQuantity",
                    event.target.value
                  )
              }
              placeholder="الكمية المستخدمة في الحقل"
              disabled={
                savingFarm ||
                savingCrop
              }
            />
          </section>

          {error && (
            <div
              className="new-farm-error"
              role="alert"
            >
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div
              className="new-farm-success"
              role="status"
            >
              ✅ {success}
            </div>
          )}

          <div
            className="new-farm-actions"
          >
            <button
              type="submit"
              className="new-farm-save-button"
              disabled={
                savingFarm ||
                savingCrop
              }
            >
              {savingCrop
                ? "جاري حفظ المشروع الزراعي..."
                : "💾 حفظ المزرعة والمشروع الزراعي"}
            </button>

            <button
              type="button"
              className="new-farm-cancel-button"
              onClick={
                cancel
              }
              disabled={
                savingFarm ||
                savingCrop
              }
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
