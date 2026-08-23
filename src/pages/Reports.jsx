// src/pages/Reports.jsx

import {
  useContext,
  useMemo,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import {
  useSettings,
} from "../context/SettingsContext";

import Card from "../components/Card";


export default function Reports() {

  const {
    farms = [],
    fields = [],
    crops = [],

    irrigations = [],
    fertilizers = [],
    pesticides = [],

    diseases = [],

    expenses = [],

    consultations = [],
    aiQuestions = [],

    harvests = [],
    inventory = [],

  } = useContext(FarmContext);


  const {
    settings,
  } = useSettings();


  // =====================================================
  // KPI
  // =====================================================

  const kpi = useMemo(
    () => ({

      farms: farms.length,

      fields: fields.length,

      crops: crops.length,

      operations:
        irrigations.length +
        fertilizers.length +
        pesticides.length +
        diseases.length,

      harvests:
        harvests.length,

      inventory:
        inventory.length,

    }),
    [
      farms,
      fields,
      crops,
      irrigations,
      fertilizers,
      pesticides,
      diseases,
      harvests,
      inventory,
    ]
  );


  // =====================================================
  // Financial Report
  // =====================================================

  const financial = useMemo(() => {

    const total = expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );


    return {

      total,

      count:
        expenses.length,

      average:
        expenses.length
          ? Math.round(
              total / expenses.length
            )
          : 0,

    };

  }, [expenses]);


  // =====================================================
  // Farm Health Score
  // =====================================================

  const healthScore = useMemo(() => {

    let score = 100;


    if (diseases.length) {
      score -= 20;
    }


    if (
      fields.length >
      irrigations.length
    ) {
      score -= 15;
    }


    if (
      fertilizers.length === 0
    ) {
      score -= 10;
    }


    if (score < 0) {
      score = 0;
    }


    return score;

  }, [
    diseases,
    fields,
    irrigations,
    fertilizers,
  ]);


  // =====================================================
  // Crop Intelligence
  // =====================================================

  const cropReport = useMemo(() => {

    const counter = {};


    crops.forEach((crop) => {

      const name =
        crop.name ||
        "غير محدد";


      counter[name] =
        (counter[name] || 0) + 1;

    });


    const result =
      Object.entries(counter)
        .sort(
          (a, b) =>
            b[1] - a[1]
        );


    return {

      top:
        result[0]?.[0] ||
        "لا يوجد",

      count:
        crops.length,

    };

  }, [crops]);


  // =====================================================
  // Smart Advice
  // =====================================================

  const advice = useMemo(() => {

    const list = [];


    if (diseases.length) {

      list.push(
        "🦠 توجد أمراض تحتاج متابعة."
      );

    }


    if (
      fields.length >
      irrigations.length
    ) {

      list.push(
        "💧 راجع خطة الري للحقول."
      );

    }


    if (expenses.length > 10) {

      list.push(
        "💰 المصاريف مرتفعة، راجع التكاليف."
      );

    }


    if (inventory.length === 0) {

      list.push(
        "📦 أضف بيانات المخزون."
      );

    }


    if (list.length === 0) {

      list.push(
        "✅ حالة المزرعة ممتازة."
      );

    }


    return list;

  }, [
    diseases,
    fields,
    irrigations,
    expenses,
    inventory,
  ]);


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="reports-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="reports-hero">

        <div className="reports-hero-icon">
          📊
        </div>


        <div className="reports-hero-content">

          <h1>
            التقارير الذكية المتقدمة
          </h1>


          <div className="reports-hero-brand">
            🌱 LAVENDER Smart Farm
          </div>


          <p>
            تحليل شامل لأداء المزرعة
          </p>

        </div>

      </section>



      {/* =================================================
          REPORT GRID
      ================================================= */}

      <div className="reports-grid">


        {/* =================================================
            KPI
        ================================================= */}

        <Card
          title="🚀 مؤشرات الأداء"
        >

          <div className="reports-main-number">
            {kpi.operations}
          </div>


          <p className="reports-main-label">
            إجمالي العمليات الزراعية
          </p>


          <div className="reports-stats">

            <div className="reports-stat">
              <span className="reports-stat-icon">
                🌾
              </span>

              <span>
                المزارع
              </span>

              <strong>
                {kpi.farms}
              </strong>
            </div>


            <div className="reports-stat">
              <span className="reports-stat-icon">
                🌱
              </span>

              <span>
                الحقول
              </span>

              <strong>
                {kpi.fields}
              </strong>
            </div>


            <div className="reports-stat">
              <span className="reports-stat-icon">
                🌿
              </span>

              <span>
                المحاصيل
              </span>

              <strong>
                {kpi.crops}
              </strong>
            </div>

          </div>

        </Card>



        {/* =================================================
            HEALTH
        ================================================= */}

        <Card
          title="❤️ صحة المزرعة"
        >

          <div className="reports-health">

            <div className="reports-health-number">
              {healthScore}%
            </div>


            <p>
              مؤشر الحالة الزراعية الذكية
            </p>

          </div>

        </Card>



        {/* =================================================
            FINANCIAL
        ================================================= */}

        <Card
          title="💰 التقرير المالي"
        >

          <div className="reports-info-list">

            <div className="reports-info-row">

              <span>
                إجمالي المصاريف
              </span>

              <strong>
                {financial.total}{" "}
                {settings?.currency || ""}
              </strong>

            </div>


            <div className="reports-info-row">

              <span>
                متوسط المصروف
              </span>

              <strong>
                {financial.average}{" "}
                {settings?.currency || ""}
              </strong>

            </div>


            <div className="reports-info-row">

              <span>
                عدد العمليات المالية
              </span>

              <strong>
                {financial.count}
              </strong>

            </div>

          </div>

        </Card>



        {/* =================================================
            CROPS
        ================================================= */}

        <Card
          title="🌿 تحليل المحاصيل"
        >

          <div className="reports-info-list">

            <div className="reports-info-row">

              <span>
                أكثر محصول
              </span>

              <strong>
                {cropReport.top}
              </strong>

            </div>


            <div className="reports-info-row">

              <span>
                عدد المحاصيل
              </span>

              <strong>
                {cropReport.count}
              </strong>

            </div>

          </div>

        </Card>



        {/* =================================================
            SMART ADVICE
        ================================================= */}

        <Card
          title="🤖 التوصيات الذكية"
          variant="smart"
        >

          <div className="reports-advice">

            {advice.map(
              (item, index) => (

                <div
                  key={index}
                  className="reports-advice-item"
                >
                  {item}
                </div>

              )
            )}

          </div>

        </Card>



        {/* =================================================
            FUTURE ACTIVITIES
        ================================================= */}

        <Card
          title="👨‍🌾 الأنشطة المستقبلية"
        >

          <div className="reports-info-list">

            <div className="reports-info-row">

              <span>
                📨 الاستشارات
              </span>

              <strong>
                {consultations.length}
              </strong>

            </div>


            <div className="reports-info-row">

              <span>
                🤖 أسئلة AI
              </span>

              <strong>
                {aiQuestions.length}
              </strong>

            </div>


            <div className="reports-info-row">

              <span>
                🚜 الحصاد
              </span>

              <strong>
                {kpi.harvests}
              </strong>

            </div>

          </div>

        </Card>



        {/* =================================================
            SYSTEM READINESS
        ================================================= */}

        <Card
          title="☁️ جاهزية النظام"
        >

          <div className="reports-readiness">

            <div>
              ✅ البيانات الزراعية مترابطة
            </div>

            <div>
              ✅ جاهز للرسوم البيانية
            </div>

            <div>
              ✅ جاهز لتصدير JSON
            </div>

            <div>
              ✅ جاهز لتصدير CSV
            </div>

            <div>
              ✅ جاهز للذكاء الاصطناعي
            </div>

            <div>
              ✅ جاهز للقاعدة السحابية
            </div>

          </div>

        </Card>


      </div>

    </div>

  );

}
