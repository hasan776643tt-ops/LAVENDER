// =========================================================
// LAVENDER — CROP REPOSITORY
// src/repositories/cropRepository.js
// =========================================================

import { storageService } from "../storage";

const CROPS_KEY = "crops";


// =========================================================
// DATE
// التاريخ الزراعي Date-Only
// لا new Date()
// لا toISOString()
// لا تاريخ اليوم
// =========================================================

function normalizeDate(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const date =
    String(value).trim();

  if (!date) {
    return "";
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return date;
  }

  return "";
}


// =========================================================
// REPOSITORY
// =========================================================

class CropRepository {

  // =======================================================
  // GET ALL
  // =======================================================

  async getAll() {

    const data =
      await storageService.load(
        CROPS_KEY,
        []
      );

    return Array.isArray(data)
      ? data
      : [];
  }


  // =======================================================
  // GET BY ID
  // =======================================================

  async getById(id) {

    if (!id) {
      return null;
    }

    const crops =
      await this.getAll();

    return (
      crops.find(
        crop =>
          String(crop?.id) ===
          String(id)
      ) || null
    );
  }


  // =======================================================
  // GET BY FARM
  // =======================================================

  async getByFarmId(farmId) {

    const id =
      String(
        farmId ?? ""
      ).trim();

    if (!id) {
      return [];
    }

    const crops =
      await this.getAll();

    return crops.filter(
      crop =>
        String(
          crop?.farmId ?? ""
        ).trim() === id
    );
  }


  // =======================================================
  // CREATE
  // =======================================================

  async create(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "CROP_DATA_REQUIRED"
      );
    }


    const crops =
      await this.getAll();


    // =====================================================
    // هذا للتتبع الداخلي فقط
    // وليس تاريخ الزراعة أو الحصاد
    // =====================================================

    const now =
      new Date().toISOString();


    // =====================================================
    // إنشاء ID حقيقي
    // =====================================================

    const id =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;


    // =====================================================
    // IMPORTANT
    //
    // id يجب أن يأتي بعد ...data
    //
    // لأن normalizeCropData() يضع:
    // id: null
    //
    // ولو وضعنا id قبل ...data
    // سيتم استبداله بـ null.
    // =====================================================

    const crop = {

      ...data,


      // ID الحقيقي يجب أن يبقى هو المسيطر
      id,


      farmId:
        data.farmId
          ? String(data.farmId)
          : "",


      // ===================================================
      // التاريخ الزراعي كما أدخله المستخدم
      // ===================================================

      plantingDate:
        normalizeDate(
          data.plantingDate
        ),


      harvestDate:
        normalizeDate(
          data.harvestDate
        ),


      // ===================================================
      // تواريخ النظام فقط
      // لا علاقة لها بتاريخ الزراعة
      // ===================================================

      createdAt:
        now,

      updatedAt:
        now,

    };


    await storageService.save(
      CROPS_KEY,
      [
        ...crops,
        crop,
      ]
    );


    return crop;
  }


  // =======================================================
  // UPDATE
  // =======================================================

  async update(
    id,
    data
  ) {

    if (!id) {
      return null;
    }


    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "CROP_DATA_REQUIRED"
      );
    }


    const crops =
      await this.getAll();


    const index =
      crops.findIndex(
        crop =>
          String(crop?.id) ===
          String(id)
      );


    if (index < 0) {
      return null;
    }


    const existing =
      crops[index];


    const updated = {

      ...existing,

      ...data,


      // ===================================================
      // ID الموجود في التخزين لا يتغير
      // ===================================================

      id:
        existing.id,


      farmId:
        data.farmId !== undefined
          ? String(data.farmId)
          : String(
              existing.farmId ?? ""
            ),


      // ===================================================
      // تاريخ الزراعة
      // ===================================================

      plantingDate:
        data.plantingDate !== undefined
          ? normalizeDate(
              data.plantingDate
            )
          : normalizeDate(
              existing.plantingDate
            ),


      // ===================================================
      // تاريخ الحصاد
      // ===================================================

      harvestDate:
        data.harvestDate !== undefined
          ? normalizeDate(
              data.harvestDate
            )
          : normalizeDate(
              existing.harvestDate
            ),


      // ===================================================
      // تواريخ النظام
      // ===================================================

      createdAt:
        existing.createdAt,

      updatedAt:
        new Date().toISOString(),

    };


    crops[index] =
      updated;


    await storageService.save(
      CROPS_KEY,
      crops
    );


    return updated;
  }


  // =======================================================
  // DELETE
  // =======================================================

  async delete(id) {

    if (!id) {
      return false;
    }


    const crops =
      await this.getAll();


    const next =
      crops.filter(
        crop =>
          String(crop?.id) !==
          String(id)
      );


    // لم يتم العثور على المحصول
    if (
      next.length ===
      crops.length
    ) {
      return false;
    }


    await storageService.save(
      CROPS_KEY,
      next
    );


    return true;
  }


  // =======================================================
  // EXISTS
  // =======================================================

  async exists(id) {

    return Boolean(
      await this.getById(id)
    );
  }


  // =======================================================
  // COUNT
  // =======================================================

  async count() {

    const crops =
      await this.getAll();

    return crops.length;
  }


  // =======================================================
  // COUNT BY FARM
  // =======================================================

  async countByFarmId(farmId) {

    const crops =
      await this.getByFarmId(
        farmId
      );

    return crops.length;
  }

}


export default Object.freeze(
  new CropRepository()
);
