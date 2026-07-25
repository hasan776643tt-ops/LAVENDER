import express from "express";

import {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop
} from "../controllers/cropController.js";


const router = express.Router();


// جلب كل المحاصيل
router.get("/", getCrops);


// جلب محصول واحد
router.get("/:id", getCropById);


// إنشاء محصول
router.post("/", createCrop);


// تعديل محصول
router.put("/:id", updateCrop);


// حذف محصول
router.delete("/:id", deleteCrop);


export default router;
