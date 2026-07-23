
import { useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Dashboard() {
  const {
    farms,
    fields,
    crops,
    irrigations,
    fertilizers,
    pesticides,
    diseases,
    expenses,
  } = useContext(FarmContext);

  return (
    <div>
      <h1>📊 لوحة التحكم</h1>

      <h2>نظام إدارة المزارع الذكية</h2>

      <p>
        ملخص سريع لجميع بيانات المزرعة.
      </p>

      <hr />

      <h2>📈 إحصائيات النظام</h2>

      <div>
        <p>
          🌾 عدد المزارع: {farms.length}
        </p>

        <p>
          🌱 عدد الحقول: {fields.length}
        </p>

        <p>
          🌿 عدد المحاصيل: {crops.length}
        </p>

        <p>
          💧 عمليات الري: {irrigations.length}
        </p>

        <p>
          🌾 عمليات التسميد: {fertilizers.length}
        </p>

        <p>
          🧪 المبيدات: {pesticides.length}
        </p>

        <p>
          🦠 الأمراض والآفات: {diseases.length}
        </p>

        <p>
          💰 المصروفات: {expenses.length}
        </p>
      </div>

      <hr />

      <h2>🕒 آخر النشاطات</h2>

      <ul>
        <li>
          لا توجد عمليات جديدة حاليًا
        </li>
      </ul>

      <hr />

      <h2>🔔 التنبيهات</h2>

      <ul>
        <li>
          ⚠️ مواعيد الري القادمة
        </li>

        <li>
          ⚠️ متابعة حالة الطقس
        </li>

        <li>
          ⚠️ مراجعة استشارات المهندس
        </li>
      </ul>
    </div>
  );
}
