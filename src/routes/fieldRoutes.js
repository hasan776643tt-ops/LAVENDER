import express from "express";

import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField
} from "../controllers/fieldController.js";


const router = express.Router();


// جلب كل الحقول
router.get("/", getFields);


// جلب حقل واحد
router.get("/:id", getFieldById);


// إنشاء حقل
router.post("/", createField);


// تعديل حقل
router.put("/:id", updateField);


// حذف حقل
router.delete("/:id", deleteField);


export default router;
