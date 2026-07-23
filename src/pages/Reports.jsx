import { useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Reports() {

  const {
    farms,
    fields,
    crops,
    expenses,
  } = useContext(FarmContext);


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
          🌾 عدد المزارع: {farms.length}
        </li>


        <li>
          🌱 عدد الحقول: {fields.length}
        </li>


        <li>
          🌿 عدد المحاصيل: {crops.length}
        </li>


        <li>
          💰 إجمالي المصاريف: {expenses.length}
        </li>


      </ul>


      <hr />


      <h2>📊 التقارير المتاحة</h2>


      <ul>

        <li>
          تقرير المحاصيل
        </li>


        <li>
          تقرير الري
        </li>


        <li>
          تقرير التسميد
        </li>


        <li>
          تقرير المبيدات
        </li>


        <li>
          تقرير المصاريف
        </li>


      </ul>


      <hr />


      <button>
        إنشاء تقرير
      </button>


    </div>
  );
}
