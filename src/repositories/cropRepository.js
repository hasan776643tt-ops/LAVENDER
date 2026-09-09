// =========================================================
// LAVENDER — CROP REPOSITORY
// src/repositories/cropRepository.js
// =========================================================

import storageService from "../storage/storageService.js";

const CROPS_KEY = "crops";

/*
 * =========================================================
 * إنشاء ID
 * =========================================================
 */

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 11)}`;
}

/*
 * =========================================================
 * التاريخ
 *
 * مهم:
 * لا نفرض أي صيغة.
 *
 * يقبل:
 * 15 5 2024
 * 15/5/2024
 * 15-5-2024
 * 15.5.2024
 * 1 1 2027
 * 2.2.2024
 *
 * ويحفظه كنص كما أدخله المستخدم.
 * =========================================================
 */

function normalizeDate(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

/*
 * =========================================================
 * جلب جميع المشاريع
 * =========================================================
 */

const cropRepository = {
  async getAll() {
    const data =
      await storageService.load(
        CROPS_KEY,
        []
      );

    if (!Array.isArray(data)) {
      return [];
    }

    let changed = false;

    const normalized =
      data.map((crop) => {
        if (
          !crop ||
          typeof crop !== "object"
        ) {
          return crop;
        }

        let id = crop.id;

        if (!id) {
          id = createId();
          changed = true;
        }

        /*
         * لا نحول تاريخ الزراعة
         * إلى تاريخ آخر.
         */

        const normalizedCrop = {
          ...crop,

          id,

          plantingDate:
            normalizeDate(
              crop.plantingDate
            ),

          harvestDate:
            normalizeDate(
              crop.harvestDate
            ),
        };

        /*
         * نعتبر التغيير فقط إذا كان
         * بسبب إضافة ID أو تنظيف
         * النص نفسه.
         */

        if (
          normalizedCrop.plantingDate !==
          crop.plantingDate
        ) {
          changed = true;
        }

        if (
          normalizedCrop.harvestDate !==
          crop.harvestDate
        ) {
          changed = true;
        }

        return normalizedCrop;
      });

    if (changed) {
      await storageService.save(
        CROPS_KEY,
        normalized
      );
    }

    return normalized;
  },

  /*
   * =======================================================
   * جلب مشروع بواسطة ID
   * =======================================================
   */

  async getById(id) {
    if (!id) {
      return null;
    }

    const crops =
      await this.getAll();

    return (
      crops.find(
        (crop) =>
          String(crop?.id) ===
          String(id)
      ) ?? null
    );
  },

  /*
   * =======================================================
   * جلب مشاريع مزرعة
   * =======================================================
   */

  async getByFarmId(farmId) {
    if (!farmId) {
      return [];
    }

    const crops =
      await this.getAll();

    return crops.filter(
      (crop) =>
        String(
          crop?.farmId ?? ""
        ).trim() ===
        String(farmId).trim()
    );
  },

  /*
   * =======================================================
   * إنشاء مشروع
   * =======================================================
   */

  async create(data = {}) {
    const crops =
      await this.getAll();

    const id =
      createId();

    const now =
      new Date().toISOString();

    const crop = {
      ...data,

      id,

      farmId:
        data.farmId
          ? String(data.farmId)
          : "",

      /*
       * التاريخ كما كتبه المستخدم.
       * لا تاريخ اليوم.
       */

      plantingDate:
        normalizeDate(
          data.plantingDate
        ),

      harvestDate:
        normalizeDate(
          data.harvestDate
        ),

      createdAt: now,

      updatedAt: now,
    };

    const updated = [
      ...crops,
      crop,
    ];

    await storageService.save(
      CROPS_KEY,
      updated
    );

    return crop;
  },

  /*
   * =======================================================
   * تعديل مشروع
   * =======================================================
   */

  async update(id, data = {}) {
    if (!id) {
      return null;
    }

    const crops =
      await this.getAll();

    const index =
      crops.findIndex(
        (crop) =>
          String(crop?.id) ===
          String(id)
      );

    if (index === -1) {
      return null;
    }

    const existing =
      crops[index];

    const updatedCrop = {
      ...existing,

      ...data,

      id: existing.id,

      farmId:
        data.farmId !== undefined
          ? String(data.farmId)
          : existing.farmId,

      /*
       * لا نفرض أي صيغة على تاريخ
       * الزراعة.
       */

      plantingDate:
        data.plantingDate !== undefined
          ? normalizeDate(
              data.plantingDate
            )
          : existing.plantingDate,

      harvestDate:
        data.harvestDate !== undefined
          ? normalizeDate(
              data.harvestDate
            )
          : existing.harvestDate,

      updatedAt:
        new Date().toISOString(),
    };

    const updated = [
      ...crops,
    ];

    updated[index] =
      updatedCrop;

    await storageService.save(
      CROPS_KEY,
      updated
    );

    return updatedCrop;
  },

  /*
   * =======================================================
   * حذف مشروع
   * =======================================================
   */

  async delete(id) {
    if (!id) {
      return false;
    }

    const crops =
      await this.getAll();

    const exists =
      crops.some(
        (crop) =>
          String(crop?.id) ===
          String(id)
      );

    if (!exists) {
      return false;
    }

    const updated =
      crops.filter(
        (crop) =>
          String(crop?.id) !==
          String(id)
      );

    await storageService.save(
      CROPS_KEY,
      updated
    );

    return true;
  },
};

export default Object.freeze(
  cropRepository
);
