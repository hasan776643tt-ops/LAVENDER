// src/pages/Dashboard.jsx

import Card from "../components/Card";
import useDashboard from "../hooks/useDashboard";

export default function Dashboard() {
  const {
    loading,
    error,
    statistics,
    financial,
    farmHealth,
    alerts,
  } = useDashboard();

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

      <Card title="🚀 صحة المزرعة">
        <h2>
          {farmHealth}%
        </h2>

        <p>
          مؤشر الحالة الزراعية
        </p>
      </Card>

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

      <Card title="🤖 التنبيهات الذكية">
        {alerts.map(
          (alert, index) => (
            <p key={index}>
              {alert}
            </p>
          )
        )}
      </Card>

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
