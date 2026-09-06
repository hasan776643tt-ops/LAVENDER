// =========================================================
// LAVENDER — CROP REPOSITORY
// src/repositories/cropRepository.js
// =========================================================

import storageService from "../storage/storageService.js";

const CROPS_KEY = "crops";

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

function normalizeDate(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value).trim();

  // تاريخ HTML input من النوع date
  // يجب أن يبقى كما هو: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  return "";
}

const cropRepository = {

  // -------------------------------------------------------
  // GET ALL
  // -------------------------------------------------------
  async getAll() {
    const data = await storageService.load(
      CROPS_KEY,
      []
    );

    if (!Array.isArray(data)) {
      return [];
    }

    let changed = false;

    // إصلاح السجلات القديمة التي ليس لديها ID
    const normalized = data.map((crop) => {

      if (!crop || typeof crop !== "object") {
        return crop;
      }

      let id = crop.id;

      if (!id) {
        id = createId();
        changed = true;
      }

      const normalizedCrop = {
        ...crop,
        id,

        // مهم جدًا:
        // لا نضع تاريخ اليوم هنا.
        plantingDate: normalizeDate(
          crop.plantingDate
        ),

        harvestDate: normalizeDate(
          crop.harvestDate
        ),
      };

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

  // -------------------------------------------------------
  // GET BY ID
  // -------------------------------------------------------
  async getById(id) {
    if (!id) {
      return null;
    }

    const crops = await this.getAll();

    return (
      crops.find(
        (crop) =>
          String(crop.id) === String(id)
      ) || null
    );
  },

  // -------------------------------------------------------
  // GET BY FARM
  // -------------------------------------------------------
  async getByFarmId(farmId) {
    if (!farmId) {
      return [];
    }

    const crops = await this.getAll();

    return crops.filter(
      (crop) =>
        String(crop.farmId) ===
        String(farmId)
    );
  },

  // -------------------------------------------------------
  // CREATE
  // -------------------------------------------------------
  async create(data = {}) {

    const crops = await this.getAll();

    const id = createId();

    const now =
      new Date().toISOString();

    /*
     * مهم جدًا:
     *
     * id يأتي بعد ...data
     * حتى لا يستطيع data.id = null
     * الكتابة فوق الـ ID الجديد.
     */

    const crop = {
      ...data,

      id,

      farmId: data.farmId
        ? String(data.farmId)
        : "",

      /*
       * التاريخ يؤخذ كما أدخله المستخدم.
       *
       * مثال:
       * 2024-05-10
       *
       * يبقى:
       * 2024-05-10
       *
       * ولا يتحول إلى تاريخ اليوم.
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

  // -------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------
  async update(id, data = {}) {

    if (!id) {
      return null;
    }

    const crops = await this.getAll();

    const index = crops.findIndex(
      (crop) =>
        String(crop.id) ===
        String(id)
    );

    if (index === -1) {
      return null;
    }

    const existing = crops[index];

    const updatedCrop = {
      ...existing,
      ...data,

      // ID لا يتغير
      id: existing.id,

      farmId: data.farmId !== undefined
        ? String(data.farmId)
        : existing.farmId,

      /*
       * لا تستخدم new Date() هنا.
       * نأخذ التاريخ القادم من المستخدم فقط.
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

    crops[index] = updatedCrop;

    await storageService.save(
      CROPS_KEY,
      crops
    );

    return updatedCrop;
  },

  // -------------------------------------------------------
  // DELETE
  // -------------------------------------------------------
  async delete(id) {

    if (!id) {
      return false;
    }

    const crops = await this.getAll();

    const index = crops.findIndex(
      (crop) =>
        String(crop.id) ===
        String(id)
    );

    if (index === -1) {
      return false;
    }

    crops.splice(index, 1);

    await storageService.save(
      CROPS_KEY,
      crops
    );

    return true;
  },
};

export default Object.freeze(
  cropRepository
);
