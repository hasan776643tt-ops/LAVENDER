import { useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";

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
    locations,
    users,
  } = useContext(FarmContext);

  return (

    <div>

      <h1>
        📊 لوحة التحكم الذكية
      </h1>

      <p>
        نظرة سريعة على جميع بيانات النظام.
      </p>

      <Card title="🌾 المزارع">

        <h2>
          {farms.length}
        </h2>

        <p>
          إجمالي المزارع المسجلة
        </p>

      </Card>

      <Card title="🌱 الحقول">

        <h2>
          {fields.length}
        </h2>

        <p>
          إجمالي الحقول
        </p>

      </Card>

      <Card title="🌿 المحاصيل">

        <h2>
          {crops.length}
        </h2>

        <p>
          إجمالي المحاصيل
        </p>

      </Card>

      <Card title="💧 الري">

        <h2>
          {irrigations.length}
        </h2>

        <p>
          عمليات الري المسجلة
        </p>

      </Card>

      <Card title="🌾 الأسمدة">

        <h2>
          {fertilizers.length}
        </h2>

        <p>
          عمليات التسميد
        </p>

      </Card>

      <Card title="🧪 المبيدات">

        <h2>
          {pesticides.length}
        </h2>

        <p>
          عمليات الرش
        </p>

      </Card>

      <Card title="🦠 الأمراض">

        <h2>
          {diseases.length}
        </h2>

        <p>
          الإصابات المسجلة
        </p>

      </Card>

      <Card title="📍 المواقع">

        <h2>
          {locations.length}
        </h2>

        <p>
          مواقع GPS المحفوظة
        </p>

      </Card>

      <Card title="👤 المستخدمون">

        <h2>
          {users.length}
        </h2>

        <p>
          المستخدمون المسجلون
        </p>

      </Card>

      <Card title="💰 المصاريف">

        <h2>
          {expenses.length}
        </h2>

        <p>
          السجلات المالية
        </p>

      </Card>

      <Card title="🔔 التنبيهات">

        <p>
          متابعة حالة الطقس للمزارع.
        </p>

        <p>
          مراجعة مواعيد الري القادمة.
        </p>

        <p>
          مراجعة الأمراض المسجلة.
        </p>

      </Card>

      <Card title="🕒 آخر نشاط">

        <p>
          يتم عرض آخر العمليات هنا
          مستقبلاً.
        </p>

      </Card>

    </div>

  );

}
