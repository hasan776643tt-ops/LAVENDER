import { useState } from "react";

export default function Dashboard() {

  const [stats] = useState({

    farms: 0,

    fields: 0,

    crops: 0,

    irrigation: 0,

    fertilizers: 0,

    pesticides: 0,

    diseases: 0,

    expenses: 0,

  });


  return (
    <div>

      <h1>📊 لوحة التحكم</h1>


      <h2>
        نظام إدارة المزارع الذكية
      </h2>


      <p>
        ملخص سريع لجميع بيانات المزرعة.
      </p>


      <hr />


      <h2>
        📈 إحصائيات النظام
      </h2>


      <div>


        <p>
          🌾 عدد المزارع: {stats.farms}
        </p>


        <p>
          🌱 عدد الحقول: {stats.fields}
        </p>


        <p>
          🌿 عدد المحاصيل: {stats.crops}
        </p>


        <p>
          💧 عمليات الري: {stats.irrigation}
        </p>


        <p>
          🌾 عمليات التسميد: {stats.fertilizers}
        </p>


        <p>
          🧪 المبيدات: {stats.pesticides}
        </p>


        <p>
          🦠 الأمراض والآفات: {stats.diseases}
        </p>


        <p>
          💰 المصروفات: {stats.expenses}
        </p>


      </div>


      <hr />


      <h2>
        🕒 آخر النشاطات
      </h2>


      <ul>

        <li>
          لا توجد عمليات جديدة حاليًا
        </li>

      </ul>


      <hr />


      <h2>
        🔔 التنبيهات
      </h2>


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
