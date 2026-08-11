// src/pages/Dashboard.jsx

import {
  useEffect,
  useMemo,
  useState
} from "react";

import Card from "../components/Card";

import farmService from "../services/farmService.js";
import fieldService from "../services/fieldService.js";
import cropService from "../services/cropService.js";
import expenseService from "../services/expenseService.js";
import harvestService from "../services/harvestService.js";
import inventoryService from "../services/inventoryService.js";


// =========================
// Dashboard
// =========================

export default function Dashboard() {

  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // Load Dashboard Data
  // =========================

  useEffect(() => {

    let mounted = true;

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          farmsData,
          fieldsData,
          cropsData,
          expensesData,
          harvestsData,
          inventoryData
        ] = await Promise.all([

          farmService.getAllFarms(),

          fieldService.getAll(),

          cropService.getAll(),

          expenseService.getAll(),

          harvestService.getAll(),

          inventoryService.getAll()

        ]);


        if (!mounted) {
          return;
        }


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


  // =========================
  // KPI Statistics
  // =========================

  const statistics = useMemo(() => [

    {
      title: "🌾 المزارع",
      value: farms.length,
      info: "إجمالي المزارع"
    },

    {
      title: "🌱 الحقول",
      value: fields.length,
      info: "الحقول المسجلة"
    },

    {
      title: "🌿 المحاصيل",
      value: crops.length,
      info: "المحاصيل الحالية"
    },

    {
      title: "💰 المصروفات",
      value: expenses.length,
      info: "سجلات المصروفات"
    },

    {
      title: "🚜 الحصاد",
      value: harvests.length,
      info: "عمليات الحصاد"
    },

    {
      title: "📦 المخزون",
      value: inventory.length,
      info: "مواد المخزون"
    }

  ], [

    farms,
    fields,
    crops,
    expenses,
    harvests,
    inventory

  ]);


  // =========================
  // Financial Analysis
  // =========================

  const financial = useMemo(() => {

    const total = expenses.reduce(

      (sum, item) => {

        const amount =
          Number(item?.amount || 0);

        return sum + (
          Number.isFinite(amount)
            ? amount
            : 0
        );

      },

      0

    );


    return {

      total,

      records:
        expenses.length

    };

  }, [expenses]);


  // =========================
  // Smart Farm Health
  // =========================

  const farmHealth = useMemo(() => {

    let score = 100;


    if (inventory.length === 0) {
      score -= 10;
    }


    if (fields.length === 0) {
      score -= 10;
    }


    if (crops.length === 0) {
      score -= 10;
    }


    if (expenses.length > 0) {
      score -= 5;
    }


    if (score < 0) {
      score = 0;
    }


    return score;

  }, [

    inventory,
    fields,
    crops,
    expenses

  ]);


  // =========================
  // Smart Alerts
  // =========================

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
        "✅ جميع البيانات الأساسية متوفرة."
      );

    }


    return result;

  }, [

    farms,
    fields,
    crops,
    inventory,
    expenses

  ]);


  // =========================
  // Loading
  // =========================

  if (loading) {

    return (

      <div>

        <h1>
          📊 لوحة التحكم الذكية
        </h1>

        <Card title="⏳ جاري التحميل">

          <p>
            جاري تحميل بيانات المزرعة...
          </p>

        </Card>

      </div>

    );

  }


  // =========================
  // Error
  // =========================

  if (error) {

    return (

      <div>

        <h1>
          📊 لوحة التحكم الذكية
        </h1>

        <Card title="⚠️ خطأ">

          <p>
            {error}
          </p>

          <p>
            حاول تحديث الصفحة مرة أخرى.
          </p>

        </Card>

      </div>

    );

  }


  // =========================
  // Render
  // =========================

  return (

    <div>

      <h1>
        📊 لوحة التحكم الذكية
      </h1>


      <p>
        🌱 LAVENDER Smart Farm
        <br />
        نظام إدارة ومراقبة المزرعة
      </p>


      {/* =========================
          Farm Health
      ========================= */}

      <Card title="🚀 صحة المزرعة">

        <h2>
          {farmHealth}%
        </h2>

        <p>
          مؤشر الحالة الزراعية
        </p>

      </Card>


      {/* =========================
          Financial
      ========================= */}

      <Card title="💰 التحليل المالي">

        <p>
          إجمالي المصاريف:
        </p>

        <h2>
          {financial.total}
        </h2>

        <p>
          عدد السجلات:{" "}
          {financial.records}
        </p>

      </Card>


      {/* =========================
          Smart Alerts
      ========================= */}

      <Card title="🤖 التنبيهات الذكية">

        {alerts.map(
          (alert, index) => (

            <p key={index}>
              {alert}
            </p>

          )
        )}

      </Card>


      {/* =========================
          Statistics
      ========================= */}

      <Card title="📈 مؤشرات النظام">

        {statistics.map(
          (item) => (

            <Card
              key={item.title}
              title={item.title}
            >

              <h2>
                {item.value}
              </h2>

              <p>
                {item.info}
              </p>

            </Card>

          )
        )}

      </Card>


      {/* =========================
          System Status
      ========================= */}

      <Card title="🌱 حالة LAVENDER">

        <p>
          ✅ نظام CRUD الزراعي فعال
        </p>

        <p>
          ✅ البيانات محفوظة محلياً
        </p>

        <p>
          ✅ Harvest متصل بالخدمة
        </p>

        <p>
          ✅ Inventory متصل بالخدمة
        </p>

        <p>
          ✅ Dashboard يستخدم Services
        </p>

        <p>
          ✅ البنية جاهزة للتطوير السحابي
        </p>

      </Card>

    </div>

  );

}
