// src/pages/Expenses.jsx

import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import {
  FarmContext
} from "../context/FarmContext";

import useCrops from "../hooks/useCrops";

import Card from "../components/Card";
import Button from "../components/Button";


// =========================================================
// أدوات مساعدة
// =========================================================

const createRowId = () => (
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random()}`
);


const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? number
    : 0;
};


// =========================================================
// الصفحة
// =========================================================

export default function Expenses() {

  const {
    farms = [],
    expenses = [],
    expenseActions,
    harvests = [],
    harvestActions
  } = useContext(FarmContext);


  const [searchParams] =
    useSearchParams();


  const requestedFarmId =
    searchParams.get("farmId") || "";


  const requestedCropId =
    searchParams.get("cropId") || "";


  // =======================================================
  // المشاريع الزراعية
  // =======================================================

  const cropHook = useCrops?.() || {};

  const crops =
    Array.isArray(cropHook.crops)
      ? cropHook.crops
      : [];


  // =======================================================
  // المزرعة والمشروع المختاران
  // =======================================================

  const [selectedFarmId, setSelectedFarmId] =
    useState(requestedFarmId);


  const [selectedCropId, setSelectedCropId] =
    useState(requestedCropId);


  useEffect(() => {

    if (requestedFarmId) {
      setSelectedFarmId(requestedFarmId);
    }

  }, [requestedFarmId]);


  useEffect(() => {

    if (requestedCropId) {
      setSelectedCropId(requestedCropId);
    }

  }, [requestedCropId]);


  // =======================================================
  // عند اختيار مزرعة
  // =======================================================

  const farmCrops =
    useMemo(() => {

      if (!selectedFarmId) {
        return crops;
      }

      return crops.filter(
        crop =>
          String(
            crop.farmId || ""
          ) === String(
            selectedFarmId
          )
      );

    }, [
      crops,
      selectedFarmId
    ]);


  const selectedFarm =
    farms.find(
      farm =>
        String(farm.id) ===
        String(selectedFarmId)
    );


  const selectedCrop =
    crops.find(
      crop =>
        String(crop.id) ===
        String(selectedCropId)
    );


  // =======================================================
  // جدول المصروفات
  // =======================================================

  const [rows, setRows] =
    useState([]);


  const [editingId, setEditingId] =
    useState(null);


  const [message, setMessage] =
    useState("");


  // =======================================================
  // تحميل مصروفات المشروع
  // =======================================================

  useEffect(() => {

    if (!selectedFarmId) {

      setRows([]);

      return;

    }


    const projectExpenses =
      expenses.filter(
        item => {

          const sameFarm =
            String(item.farmId || "") ===
            String(selectedFarmId);


          if (!sameFarm) {
            return false;
          }


          // إذا كان هناك مشروع محدد،
          // نعرض مصروفاته فقط.
          if (selectedCropId) {

            return (
              String(
                item.cropId || ""
              ) ===
              String(selectedCropId)
            );

          }


          // دعم المصروفات القديمة
          // التي لم يكن لديها cropId.
          return !item.cropId;

        }
      );


    setRows(projectExpenses);

  }, [
    expenses,
    selectedFarmId,
    selectedCropId
  ]);


  // =======================================================
  // إضافة سطر جديد
  // =======================================================

  const addExpenseRow = () => {

    setRows(prev => [

      ...prev,

      {
        id: `new-${createRowId()}`,

        farmId:
          selectedFarmId,

        cropId:
          selectedCropId,

        type: "",

        quantity: "",

        unit: "",

        amount: "",

        currency: "USD",

        date:
          new Date()
            .toISOString()
            .slice(0, 10),

        notes: "",

        isNew: true

      }

    ]);

  };


  // =======================================================
  // تغيير سطر
  // =======================================================

  const updateRow = (
    id,
    key,
    value
  ) => {

    setRows(prev =>

      prev.map(row =>

        String(row.id) ===
        String(id)

          ? {
              ...row,
              [key]: value
            }

          : row

      )

    );

  };


  // =======================================================
  // حفظ سطر
  // =======================================================

  const saveRow = async (row) => {

    if (!row.type?.trim()) {

      setMessage(
        "⚠️ اكتب اسم المصروف أولاً."
      );

      return;

    }


    if (
      row.amount === "" ||
      numberValue(row.amount) <= 0
    ) {

      setMessage(
        "⚠️ اكتب قيمة المصروف."
      );

      return;

    }


    const data = {

      farmId:
        selectedFarmId,

      cropId:
        selectedCropId || "",

      type:
        row.type.trim(),

      quantity:
        row.quantity === ""
          ? ""
          : numberValue(row.quantity),

      unit:
        row.unit || "",

      amount:
        numberValue(row.amount),

      currency:
        row.currency || "USD",

      date:
        row.date || "",

      notes:
        row.notes || ""

    };


    try {

      if (
        row.isNew ||
        String(row.id).startsWith("new-")
      ) {

        const created =
          await expenseActions.create({

            ...data,

            createdAt:
              new Date()
                .toISOString()

          });


        setRows(prev =>

          prev.map(item =>

            String(item.id) ===
            String(row.id)

              ? created

              : item

          )

        );

      } else {

        const updated =
          await expenseActions.update(
            row.id,
            data
          );


        setRows(prev =>

          prev.map(item =>

            String(item.id) ===
            String(row.id)

              ? updated

              : item

          )

        );

      }


      setEditingId(null);

      setMessage(
        "✅ تم حفظ المصروف."
      );

    } catch (error) {

      console.error(
        "Expense save error:",
        error
      );

      setMessage(
        "❌ تعذر حفظ المصروف."
      );

    }

  };


  // =======================================================
  // حذف سطر
  // =======================================================

  const deleteRow = async (row) => {

    if (
      String(row.id).startsWith("new-")
    ) {

      setRows(prev =>
        prev.filter(
          item =>
            String(item.id) !==
            String(row.id)
        )
      );

      return;

    }


    try {

      await expenseActions.delete(
        row.id
      );

      setRows(prev =>
        prev.filter(
          item =>
            String(item.id) !==
            String(row.id)
        )
      );

      setMessage(
        "✅ تم حذف المصروف."
      );

    } catch (error) {

      console.error(
        "Expense delete error:",
        error
      );

      setMessage(
        "❌ تعذر حذف المصروف."
      );

    }

  };


  // =======================================================
  // المصروفات النهائية فقط
  // =======================================================

  const savedRows =
    rows.filter(
      row =>
        !String(row.id)
          .startsWith("new-")
    );


  // =======================================================
  // إجمالي المصروفات
  // =======================================================

  const totalExpenses =
    useMemo(() => {

      return rows.reduce(
        (sum, row) => {

          return (
            sum +
            numberValue(
              row.amount
            )
          );

        },
        0
      );

    }, [rows]);


  // =======================================================
  // بحث
  // =======================================================

  const [search, setSearch] =
    useState("");


  const visibleRows =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      if (!value) {
        return rows;
      }


      return rows.filter(
        row =>
          String(
            row.type || ""
          )
            .toLowerCase()
            .includes(value)
      );

    }, [
      rows,
      search
    ]);


  // =======================================================
  // بيانات الإنتاج
  // =======================================================

  const projectHarvests =
    useMemo(() => {

      return harvests.filter(
        item => {

          if (
            String(item.farmId || "") !==
            String(selectedFarmId)
          ) {
            return false;
          }


          if (selectedCropId) {

            return (
              String(
                item.cropId || ""
              ) ===
              String(selectedCropId)
            );

          }


          return true;

        }
      );

    }, [
      harvests,
      selectedFarmId,
      selectedCropId
    ]);


  const latestHarvest =
    projectHarvests.length
      ? projectHarvests[
          projectHarvests.length - 1
        ]
      : null;


  const [production, setProduction] =
    useState("");


  const [productionUnit, setProductionUnit] =
    useState("طن");


  const [salePrice, setSalePrice] =
    useState("");


  const [productionCurrency, setProductionCurrency] =
    useState("USD");


  useEffect(() => {

    if (!latestHarvest) {
      return;
    }


    setProduction(
      latestHarvest.quantity ??
      latestHarvest.productionQuantity ??
      ""
    );


    setProductionUnit(
      latestHarvest.unit ||
      latestHarvest.productionUnit ||
      "طن"
    );


    setSalePrice(
      latestHarvest.salePrice ??
      latestHarvest.price ??
      ""
    );


    setProductionCurrency(
      latestHarvest.currency ||
      "USD"
    );

  }, [latestHarvest]);


  // =======================================================
  // حساب الإيراد
  // =======================================================

  const totalRevenue =
    useMemo(() => {

      return (
        numberValue(production) *
        numberValue(salePrice)
      );

    }, [
      production,
      salePrice
    ]);


  // =======================================================
  // صافي الربح
  // =======================================================

  const netProfit =
    totalRevenue -
    totalExpenses;


  // =======================================================
  // حفظ الإنتاج
  // =======================================================

  const saveProduction = async () => {

    if (!selectedFarmId) {

      setMessage(
        "⚠️ اختر المزرعة أولاً."
      );

      return;

    }


    if (
      numberValue(production) <= 0
    ) {

      setMessage(
        "⚠️ اكتب كمية الإنتاج."
      );

      return;

    }


    if (
      numberValue(salePrice) <= 0
    ) {

      setMessage(
        "⚠️ اكتب سعر البيع."
      );

      return;

    }


    // إذا كان هناك سجل حصاد موجود
    // يتم تحديثه.
    if (
      latestHarvest &&
      harvestActions?.update
    ) {

      await harvestActions.update(

        latestHarvest.id,
