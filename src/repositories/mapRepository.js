// src/repositories/mapRepository.js

import { storageService } from "../storage";


// =========================================================
// LAVENDER — MAP REPOSITORY
// =========================================================
//
// المسؤول فقط عن تخزين واسترجاع LocationData.
//
// لا يحتوي على:
// - MapModel
// - Leaflet
// - Nominatim
// - حسابات جغرافية
// - React
// - منطق المحاصيل
//
// العلاقة:
// farmId → LocationData
//
// القاعدة:
// لكل مزرعة LocationData واحد فعّال.
// عند حفظ موقع جديد لنفس farmId يتم تحديث الموقع
// الموجود بدل إنشاء سجل مكرر.
//
// =========================================================


const LOCATIONS_KEY = "locations";


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


    /*
     * -----------------------------------------------------
     * تنظيف السجلات المكررة القديمة
     * -----------------------------------------------------
     *
     * إذا كان هناك أكثر من LocationData لنفس farmId،
     * نحتفظ بأحدث سجل فقط.
     *
     * هذا يعالج السجلات التي تم إنشاؤها سابقًا
     * قبل تطبيق قاعدة عدم التكرار.
     */

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
        item?.farmId
          ? String(
              item.farmId
            )
          : "";


      /*
       * السجلات القديمة التي لا تحتوي farmId
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


      const existing =
        latestByFarm.get(
          farmId
        );


      if (
        !existing
      ) {

        latestByFarm.set(
          farmId,
          item
        );

        continue;

      }


      const existingTime =
        new Date(
          existing?.updatedAt ||
          existing?.createdAt ||
          0
        ).getTime();


      const currentTime =
        new Date(
          item?.updatedAt ||
          item?.createdAt ||
          0
        ).getTime();


      if (
        currentTime >=
        existingTime
      ) {

        latestByFarm.set(
          farmId,
          item
        );

      }

    }


    const locations = [

      ...withoutFarm,

      ...latestByFarm.values(),

    ];


    /*
     * حفظ النسخة النظيفة إذا كان هناك تكرار.
     */

    if (
      locations.length !==
      data.length
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
      !id
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
          String(
            id
          )
      ) ||
      null
    );

  }


  // =======================================================
  // GET BY FARM
  // =======================================================

  async getByFarmId(
    farmId
  ) {

    if (
      !farmId
    ) {

      return [];

    }


    const locations =
      await this.getAll();


    return locations.filter(
      item =>
        String(
          item?.farmId
        ) ===
        String(
          farmId
        )
    );

  }


  // =======================================================
  // GET ACTIVE LOCATION BY FARM
  // =======================================================

  async getLatestByFarmId(
    farmId
  ) {

    if (
      !farmId
    ) {

      return null;

    }


    const locations =
      await this.getByFarmId(
        farmId
      );


    if (
      !locations.length
    ) {

      return null;

    }


    const active =
      locations.filter(
        item =>
          item?.status !==
          "archived"
      );


    const source =
      active.length
        ? active
        : locations;


    return (
      [
        ...source,
      ].sort(
        (
          a,
          b
        ) =>
          new Date(
            b?.updatedAt ||
            b?.createdAt ||
            0
          ) -
          new Date(
            a?.updatedAt ||
            a?.createdAt ||
            0
          )
      )[0] ||
      null
    );

  }


  // =======================================================
  // CREATE / UPDATE BY FARM
  // =======================================================
  //
  // إذا كان للمزرعة موقع موجود:
  // يتم تحديثه.
  //
  // إذا لم يكن للمزرعة موقع:
  // يتم إنشاء موقع جديد.
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


    if (
      !data.farmId
    ) {

      throw new Error(
        "MAP_FARM_REQUIRED"
      );

    }


    const locations =
      await this.getAll();


    const farmId =
      String(
        data.farmId
      );


    /*
     * البحث عن موقع موجود لنفس المزرعة.
     */

    const existingIndex =
      locations.findIndex(
        item =>
          String(
            item?.farmId
          ) ===
          farmId
      );


    const now =
      new Date().toISOString();


    // =====================================================
    // UPDATE EXISTING LOCATION
    // =====================================================

    if (
      existingIndex !==
      -1
    ) {

      const existing =
        locations[
          existingIndex
        ];


      const updated = {

        ...existing,

        ...data,

        /*
         * نحافظ على ID الأصلي.
         */

        id:
          existing.id,

        /*
         * farmId لا يتغير.
         */

        farmId:
          farmId,

        /*
         * تاريخ الإنشاء الأصلي يبقى محفوظًا.
         */

        createdAt:
          existing.createdAt ||
          now,

        /*
         * تاريخ التعديل يتحدث.
         */

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

      farmId:
        farmId,

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
      !id
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
          String(
            id
          )
      );


    if (
      index === -1
    ) {

      return null;

    }


    const updated = {

      ...locations[index],

      ...data,

      id:
        locations[index].id,

      farmId:
        String(
          data.farmId ??
          locations[index].farmId ??
          ""
        ),

      updatedAt:
        new Date().toISOString(),

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
      !id
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
          String(
            id
          )
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

    return Boolean(
      await this.getById(
        id
      )
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


export default Object.freeze(
  mapRepository
);
