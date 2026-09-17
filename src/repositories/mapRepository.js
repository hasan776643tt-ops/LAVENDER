// =========================================================
// LAVENDER — MAP REPOSITORY
// src/repositories/mapRepository.js
// =========================================================
//
// المسؤول فقط عن تخزين واسترجاع مواقع المزارع.
//
// العلاقة الأساسية:
//
// farmId → LocationData
//
// القاعدة:
//
// لكل مزرعة موقع واحد فعّال.
// عند حفظ موقع جديد لنفس farmId يتم تحديث الموقع
// الموجود بدل إنشاء موقع مكرر.
//
// لا يحتوي هذا الملف على:
// - React
// - Leaflet
// - Nominatim
// - Weather
// - Crops
// - UI
// - حسابات جغرافية
//
// المسار:
//
// Map Page
//    ↓
// useMap
//    ↓
// mapService
//    ↓
// mapRepository
//    ↓
// storageService
//
// =========================================================

import { storageService } from "../storage";


// =========================================================
// CONSTANTS
// =========================================================

const LOCATIONS_KEY = "locations";


// =========================================================
// HELPERS
// =========================================================

function normalizeFarmId(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();

}


function getFarmId(item) {

  if (
    !item ||
    typeof item !== "object"
  ) {
    return "";
  }

  return normalizeFarmId(

    item.farmId ??
    item.farmID ??
    item.farm_id ??
    item.farm?.id ??
    item.farm?.farmId ??
    ""

  );

}


function normalizeCoordinates(data) {

  if (
    !data ||
    typeof data !== "object"
  ) {
    return {
      latitude: null,
      longitude: null,
    };
  }

  const latitude =
    data.latitude ??
    data.lat ??
    null;

  const longitude =
    data.longitude ??
    data.lng ??
    data.lon ??
    null;

  return {
    latitude,
    longitude,
  };

}


// =========================================================
// MAP REPOSITORY
// =========================================================

class MapRepository {


  // =======================================================
  // GET ALL
  // =======================================================

  async getAll() {

    const data =
      await storageService.load(
        LOCATIONS_KEY,
        []
      );


    if (
      !Array.isArray(data)
    ) {

      return [];

    }


    const latestByFarm =
      new Map();


    const withoutFarm =
      [];


    for (
      const item of data
    ) {

      if (
        !item ||
        typeof item !== "object"
      ) {

        continue;

      }


      const farmId =
        getFarmId(item);


      /*
       * السجلات التي لا تحتوي farmId
       * لا نحذفها تلقائيًا.
       */

      if (
        !farmId
      ) {

        withoutFarm.push(
          item
        );

        continue;

      }


      /*
       * توحيد farmId داخل السجل.
       */

      const normalizedItem = {

        ...item,

        farmId,

      };


      const existing =
        latestByFarm.get(
          farmId
        );


      if (
        !existing
      ) {

        latestByFarm.set(
          farmId,
          normalizedItem
        );

        continue;

      }


      const existingTime =
        new Date(
          existing.updatedAt ||
          existing.createdAt ||
          0
        ).getTime();


      const currentTime =
        new Date(
          normalizedItem.updatedAt ||
          normalizedItem.createdAt ||
          0
        ).getTime();


      if (
        currentTime >=
        existingTime
      ) {

        latestByFarm.set(
          farmId,
          normalizedItem
        );

      }

    }


    const locations = [

      ...withoutFarm,

      ...latestByFarm.values(),

    ];


    /*
     * إذا تم تنظيف سجلات مكررة
     * أو توحيد farmId،
     * نحفظ البيانات الجديدة.
     */

    const originalSerialized =
      JSON.stringify(data);


    const cleanedSerialized =
      JSON.stringify(locations);


    if (
      originalSerialized !==
      cleanedSerialized
    ) {

      await storageService.save(
        LOCATIONS_KEY,
        locations
      );

    }


    return locations;

  }


  // =======================================================
  // GET BY ID
  // =======================================================

  async getById(
    id
  ) {

    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {

      return null;

    }


    const locations =
      await this.getAll();


    return (

      locations.find(
        item =>
          String(
            item?.id
          ) ===
          String(id)
      ) ||

      null

    );

  }


  // =======================================================
  // GET BY FARM ID
  // =======================================================

  async getByFarmId(
    farmId
  ) {

    const wantedFarmId =
      normalizeFarmId(
        farmId
      );


    if (
      !wantedFarmId
    ) {

      return [];

    }


    const locations =
      await this.getAll();


    return locations.filter(
      item =>
        getFarmId(item) ===
        wantedFarmId
    );

  }


  // =======================================================
  // GET LATEST LOCATION BY FARM
  // =======================================================

  async getLatestByFarmId(
    farmId
  ) {

    const locations =
      await this.getByFarmId(
        farmId
      );


    if (
      locations.length === 0
    ) {

      return null;

    }


    /*
     * نحاول أولًا استخدام الموقع
     * غير المؤرشف.
     */

    const active =
      locations.filter(
        item =>
          item?.status !==
          "archived"
      );


    const source =
      active.length > 0
        ? active
        : locations;


    const sorted = [
      ...source,
    ].sort(
      (
        a,
        b
      ) => {

        const dateA =
          new Date(
            a?.updatedAt ||
            a?.createdAt ||
            0
          ).getTime();


        const dateB =
          new Date(
            b?.updatedAt ||
            b?.createdAt ||
            0
          ).getTime();


        return (
          dateB -
          dateA
        );

      }
    );


    return (
      sorted[0] ||
      null
    );

  }


  // =======================================================
  // CREATE / UPDATE BY FARM
  // =======================================================
  //
  // هذه هي النقطة الأساسية لربط GPS بالمزرعة.
  //
  // إذا كان farmId موجودًا:
  // نبحث عن الموقع الخاص بهذه المزرعة.
  //
  // إذا وجدناه:
  // نحدث نفس الموقع.
  //
  // إذا لم نجده:
  // ننشئ موقعًا جديدًا.
  //
  // =======================================================

  async create(
    data
  ) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "MAP_DATA_REQUIRED"
      );

    }


    const farmId =
      getFarmId(data);


    if (
      !farmId
    ) {

      throw new Error(
        "MAP_FARM_REQUIRED"
      );

    }


    const coordinates =
      normalizeCoordinates(
        data
      );


    if (
      coordinates.latitude === null ||
      coordinates.longitude === null
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    const locations =
      await this.getAll();


    /*
     * البحث عن الموقع بواسطة farmId.
     */

    const existingIndex =
      locations.findIndex(
        item =>
          getFarmId(item) ===
          farmId
      );


    const now =
      new Date().toISOString();


    // =====================================================
    // UPDATE EXISTING LOCATION
    // =====================================================

    if (
      existingIndex !== -1
    ) {

      const existing =
        locations[
          existingIndex
        ];


      const updated = {

        ...existing,

        ...data,

        /*
         * نثبت ID الأصلي.
         */

        id:
          existing.id,


        /*
         * نثبت farmId.
         */

        farmId,


        /*
         * نوحد الإحداثيات.
         */

        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,


        /*
         * نبقي الإحداثيات القديمة
         * بصيغة lat/lng أيضًا
         * للتوافق مع الأكواد القديمة.
         */

        lat:
          coordinates.latitude,

        lng:
          coordinates.longitude,


        createdAt:
          existing.createdAt ||
          now,


        updatedAt:
          now,


        status:
          data.status ||
          existing.status ||
          "active",

      };


      locations[
        existingIndex
      ] =
        updated;


      await storageService.save(
        LOCATIONS_KEY,
        locations
      );


      return updated;

    }


    // =====================================================
    // CREATE NEW LOCATION
    // =====================================================

    const id =

      typeof crypto !==
        "undefined" &&

      typeof crypto.randomUUID ===
        "function"

        ? crypto.randomUUID()

        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;


    const location = {

      id,


      ...data,


      /*
       * farmId الموحد.
       */

      farmId,


      /*
       * GPS.
       */

      latitude:
        coordinates.latitude,

      longitude:
        coordinates.longitude,


      /*
       * توافق مع lat/lng.
       */

      lat:
        coordinates.latitude,

      lng:
        coordinates.longitude,


      createdAt:
        data.createdAt ||
        now,


      updatedAt:
        now,


      status:
        data.status ||
        "active",

    };


    locations.push(
      location
    );


    await storageService.save(
      LOCATIONS_KEY,
      locations
    );


    return location;

  }


  // =======================================================
  // UPDATE
  // =======================================================

  async update(
    id,
    data
  ) {

    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {

      return null;

    }


    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "MAP_DATA_REQUIRED"
      );

    }


    const locations =
      await this.getAll();


    const index =
      locations.findIndex(
        item =>
          String(
            item?.id
          ) ===
          String(id)
      );


    if (
      index === -1
    ) {

      return null;

    }


    const existing =
      locations[index];


    /*
     * farmId الجديد، إن وجد.
     */

    const farmId =
      normalizeFarmId(

        data.farmId ??
        data.farmID ??
        data.farm_id ??
        existing.farmId ??
        existing.farmID ??
        existing.farm_id ??
        existing.farm?.id ??
        ""

      );


    if (
      !farmId
    ) {

      throw new Error(
        "MAP_FARM_REQUIRED"
      );

    }


    const coordinates =
      normalizeCoordinates({

        ...existing,

        ...data,

      });


    if (
      coordinates.latitude === null ||
      coordinates.longitude === null
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    const updated = {

      ...existing,

      ...data,


      id:
        existing.id,


      farmId,


      latitude:
        coordinates.latitude,

      longitude:
        coordinates.longitude,


      lat:
        coordinates.latitude,

      lng:
        coordinates.longitude,


      createdAt:
        existing.createdAt ||
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString(),


      status:
        data.status ||
        existing.status ||
        "active",

    };


    locations[index] =
      updated;


    await storageService.save(
      LOCATIONS_KEY,
      locations
    );


    return updated;

  }


  // =======================================================
  // DELETE
  // =======================================================

  async delete(
    id
  ) {

    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {

      return false;

    }


    const locations =
      await this.getAll();


    const next =
      locations.filter(
        item =>
          String(
            item?.id
          ) !==
          String(id)
      );


    if (
      next.length ===
      locations.length
    ) {

      return false;

    }


    await storageService.save(
      LOCATIONS_KEY,
      next
    );


    return true;

  }


  // =======================================================
  // EXISTS
  // =======================================================

  async exists(
    id
  ) {

    const location =
      await this.getById(
        id
      );


    return Boolean(
      location
    );

  }


  // =======================================================
  // COUNT
  // =======================================================

  async count() {

    const locations =
      await this.getAll();


    return locations.length;

  }

}


// =========================================================
// SINGLETON
// =========================================================

const mapRepository =
  new MapRepository();


// =========================================================
// EXPORT
// =========================================================

export default Object.freeze(
  mapRepository
);
