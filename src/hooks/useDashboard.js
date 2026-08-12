import {
  useEffect,
  useMemo,
  useState,
} from "react";

import farmService
  from "../services/farmService.js";

import fieldService
  from "../services/fieldService.js";

import cropService
  from "../services/cropService.js";

import expenseService
  from "../services/expenseService.js";

import harvestService
  from "../services/harvestService.js";

import inventoryService
  from "../services/inventoryService.js";

export default function useDashboard() {
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.all([
          farmService.getAllFarms(),
          fieldService.getAll(),
          cropService.getAll(),
          expenseService.getAll(),
          harvestService.getAll(),
          inventoryService.getAll(),
        ]);

        if (!mounted) {
          return;
        }

        const [
          farmsData,
          fieldsData,
          cropsData,
          expensesData,
          harvestsData,
          inventoryData,
        ] = results;

        setFarms(
          Array.isArray(farmsData)
            ? farmsData
            : []
        );

        setFields(
          Array.isArray(fieldsData)
            ? fieldsData
            : []
        );

        setCrops(
          Array.isArray(cropsData)
            ? cropsData
            : []
        );

        setExpenses(
          Array.isArray(expensesData)
            ? expensesData
            : []
        );

        setHarvests(
          Array.isArray(harvestsData)
            ? harvestsData
            : []
        );

        setInventory(
          Array.isArray(inventoryData)
            ? inventoryData
            : []
        );
      } catch (err) {
        console.error(
          "Dashboard data loading failed:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "حدث خطأ أثناء تحميل بيانات لوحة التحكم"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const statistics = useMemo(
    () => [
      {
        title: "🌾 المزارع",
        value: farms.length,
        info: "إجمالي المزارع",
      },
      {
        title: "🌱 الحقول",
        value: fields.length,
        info: "الحقول المسجلة",
      },
      {
        title: "🌿 المحاصيل",
        value: crops.length,
        info: "المحاصيل الحالية",
      },
      {
        title: "💰 المصروفات",
        value: expenses.length,
        info: "سجلات المصروفات",
      },
      {
        title: "🚜 الحصاد",
        value: harvests.length,
        info: "عمليات الحصاد",
      },
      {
        title: "📦 المخزون",
        value: inventory.length,
        info: "مواد المخزون",
      },
    ],
    [
      farms,
      fields,
      crops,
      expenses,
      harvests,
      inventory,
    ]
  );

  const financial = useMemo(() => {
    const total = expenses.reduce(
      (sum, item) =>
        sum +
        Number(item?.amount || 0),
      0
    );

    return {
      total,
      records: expenses.length,
    };
  }, [expenses]);

  const farmHealth = useMemo(() => {
    let score = 100;

    if (
      fields.length > 0 &&
      harvests.length === 0
    ) {
      score -= 10;
    }

    if (farms.length === 0) {
      score -= 10;
    }

    if (inventory.length === 0) {
      score -= 10;
    }

    if (score < 0) {
      score = 0;
    }

    return score;
  }, [
    farms,
    fields,
    harvests,
    inventory,
  ]);

  const alerts = useMemo(() => {
    const result = [];

    if (farms.length === 0) {
      result.push(
        "🌾 لم تتم إضافة أي مزرعة بعد."
      );
    }

    if (fields.length === 0) {
      result.push(
        "🌱 لم تتم إضافة أي حقل بعد."
      );
    }

    if (crops.length === 0) {
      result.push(
        "🌿 لم تتم إضافة أي محصول بعد."
      );
    }

    if (inventory.length === 0) {
      result.push(
        "📦 المخزون فارغ، أضف المواد الزراعية."
      );
    }

    if (expenses.length === 0) {
      result.push(
        "💰 لا توجد سجلات مصروفات."
      );
    }

    if (result.length === 0) {
      result.push(
        "✅ جميع البيانات الأساسية موجودة."
      );
    }

    return result;
  }, [
    farms,
    fields,
    crops,
    inventory,
    expenses,
  ]);

  return {
    farms,
    fields,
    crops,
    expenses,
    harvests,
    inventory,

    loading,
    error,

    statistics,
    financial,
    farmHealth,
    alerts,
  };
}
