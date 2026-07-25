import express from "express";

import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm
} from "../controllers/farmController.js";


const router = express.Router();


// جلب كل المزارع
router.get("/", getFarms);


// جلب مزرعة واحدة
router.get("/:id", getFarmById);


// إنشاء مزرعة
router.post("/", createFarm);


// تعديل مزرعة
router.put("/:id", updateFarm);


// حذف مزرعة
router.delete("/:id", deleteFarm);


export default router;
