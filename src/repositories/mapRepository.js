// src/repositories/mapRepository.js

import { storageService } from "../storage";

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
     * الموقع الفعّال لكل مزرعة يجب أن يظهر مرة واحدة فقط.
     *
     * إذا كانت هناك سجلات قديمة مكررة لنفس farmId،
     * نحتفظ بأحدث سجل فقط.
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


      const itemFarmId =
        item?.farmId
          ? String(
              item.farmId
            )
          : "";


      if (
        !itemFarmId
      ) {

        withoutFarm.push(
          item
        );

        continue;

      }


      const existing =
        latestByFarm.get(
          itemFarmId
        );


      if (
        !existing
      ) {

        latestByFarm.set(
          itemFarmId,
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
          itemFarmId,
          item
        );

      }

    }


    const locations = [

      ...withoutFarm,

      ...latestByFarm.values(),

    ];


    /*
     * تنظيف السجلات المكررة القديمة من التخزين.
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
  // GET BY FARM ID
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
  // GET LATEST BY FARM ID
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
  // CREATE / UPSERT BY FARM
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


    /*
     * مهم:
     * لا ننشئ موقعًا ثانيًا لنفس المزرعة.
     * إذا كان للمزرعة موقع موجود، يتم تحديثه.
     */

    const locations =
      await this.getAll();


    const farmId =
      String(
        data.farmId
      );


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
    // UPDATE EXISTING FARM LOCATION
    // =====================================================

    if (
      existingIndex !==
      -1
    ) {

      const existing =
        locations[
          existingIndex
        ];


      const updated =
        {

          ...existing,

          ...data,

          id:
            existing.id,

          farmId:
            farmId,

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
    // CREATE NEW FARM LOCATION
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


    const location =
      {

        id:

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


    const updated =
      {

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
