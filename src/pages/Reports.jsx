import { useState } from "react";

export default function Reports() {

  const [report] = useState({

    farms: 0,

    fields: 0,

    crops: 0,

    expenses: 0,

    production: 0,

  });


  return (
    <div>

      <h1>📈 تقارير المزرعة</h1>


      <p>
        صفحة التقارير تعرض ملخص بيانات نظام إدارة المزارع.
      </p>


      <hr />


      <h2>🌱 تقرير عام</h2>


      <ul>

        <li>
          🌾 عدد المزارع: {report.farms}
        </li>

        <li>
          🌱 عدد الحقول: {report.fields}
        </li>

        <li>
          🌿 عدد المحاصيل: {report.crops}
        </li>

        <li>
          💰 إجمالي المصاريف: {report.expenses}
        </li>

        <li>
          📦 الإنتاج: {report.production}
        </li>

      </ul>


      <hr />


      <h2>📊 التقارير المتاحة</h2>


      <ul>

        <li>تقرير المحاصيل</li>

        <li>تقرير الري</li>

        <li>تقرير التسميد</li>

        <li>تقرير المبيدات</li>

        <li>تقرير المصاريف</li>

      </ul>


      <hr />


      <button>
        إنشاء تقرير
      </button>


    </div>
  );
}
