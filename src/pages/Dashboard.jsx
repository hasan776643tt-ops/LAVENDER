// src/pages/Dashboard.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Card from "../components/Card";

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



export default function Dashboard() {

  // =========================
  // Data
  // =========================

  const [farms, setFarms] =
    useState([]);

  const [fields, setFields] =
    useState([]);

  const [crops, setCrops] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [harvests, setHarvests] =
    useState([]);

  const [inventory, setInventory] =
    useState([]);


  // =========================
  // Loading
  // =========================

  const [loading, setLoading] =
    useState(true);


  // =========================
  // Error
  // =========================

  const [error, setError] =
    useState("");


  // =========================
  // Load Dashboard Data
  // =========================

  useEffect(() => {

    let mounted = true;


    const loadDashboard =
      async () => {

        try {

          setLoading(true);
          setError("");


          const results =
            await Promise.all([

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


  // =========================
  // KPI Statistics
  // =========================

  const statistics = useMemo(() => [

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

  ], [

    farms,
    fields,
    crops,
    expenses,
    harvests,
    inventory,

  ]);


  // =========================
  // Financial
  // =========================

  const financial =
    useMemo(() => {

      const total =
        expenses.reduce(

          (sum, item) => {

            return (
              sum +
              Number(
                item?.amount || 0
              )
            );

          },

          0

        );


      return {

        total,

        records:
          expenses.length,

      };

    }, [expenses]);


  // =========================
  // Smart Health
  // =========================

  const farmHealth =
    useMemo(() => {

      let score = 100;


      /*
       * لا توجد بيانات أمراض
       * في Dashboard الحالي،
       * لذلك لا نعاقب المؤشر عليها.
       */


      if (
        fields.length > 0 &&
        harvests.length === 0
      ) {

        score -= 10;

      }


      if (
        farms.length === 0
      ) {

        score -= 10;

      }


      if (
        inventory.length === 0
      ) {

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


  // =========================
  // Smart Alerts
  // =========================

  const alerts =
    useMemo(() => {

      const result = [];


      if (
        farms.length === 0
      ) {

        result.push(
          "🌾 لم تتم إضافة أي مزرعة بعد."
        );

      }


      if (
        fields.length === 0
      ) {

        result.push(
          "🌱 لم تتم إضافة أي حقل بعد."
        );

      }


      if (
        crops.length === 0
      ) {

        result.push(
          "🌿 لم تتم إضافة أي محصول بعد."
        );

      }


      if (
        inventory.length === 0
      ) {

        result.push(
          "📦 المخزون فارغ، أضف المواد الزراعية."
        );

      }


      if (
        expenses.length === 0
      ) {

        result.push(
          "💰 لا توجد سجلات مصروفات."
        );

      }


      if (
        result.length === 0
      ) {

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


  // =========================
  // Loading UI
  // =========================

  if (loading) {

    return (

      <div>

        <h1>
          📊 لوحة التحكم الذكية
        </h1>

        <Card title="⏳ تحميل البيانات">

          <p>
            جاري تحميل بيانات المزرعة...
          </p>

        </Card>

      </div>

    );

  }


  // =========================
  // Error UI
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
            تحقق من خدمات البيانات
            والمستودعات المرتبطة بها.
          </p>

        </Card>

      </div>

    );

  }


  // =========================
  // Dashboard
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
          عدد السجلات:
          {" "}
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
