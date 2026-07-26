import { useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Reports() {

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

      <h1>
        📊 التقارير والإحصائيات
      </h1>

      <Card title="ملخص النظام">

        <p>
          🌾 عدد المزارع:
          {" "}
          {farms.length}
        </p>

        <p>
          🌱 عدد الحقول:
          {" "}
          {fields.length}
        </p>

        <p>
          🌿 عدد المحاصيل:
          {" "}
          {crops.length}
        </p>

        <p>
          💧 عمليات الري:
          {" "}
          {irrigations.length}
        </p>

        <p>
          🌾 عمليات التسميد:
          {" "}
          {fertilizers.length}
        </p>

        <p>
          🧪 عمليات المبيدات:
          {" "}
          {pesticides.length}
        </p>

        <p>
          🦠 الأمراض المسجلة:
          {" "}
          {diseases.length}
        </p>

        <p>
          💰 المصاريف:
          {" "}
          {expenses.length}
        </p>

      </Card>

      <Card title="التقارير المتاحة">

        <p>
          🌾 تقرير المزارع
        </p>

        <p>
          🌱 تقرير الحقول
        </p>

        <p>
          🌿 تقرير المحاصيل
        </p>

        <p>
          💧 تقرير الري
        </p>

        <p>
          🌾 تقرير الأسمدة
        </p>

        <p>
          🧪 تقرير المبيدات
        </p>

        <p>
          🦠 تقرير الأمراض
        </p>

        <p>
          💰 تقرير المصاريف
        </p>

      </Card>

      <Card title="التوصيات الذكية">

        <p>
          إذا زاد عدد الأمراض المسجلة،
          يوصى بمراجعة برنامج المكافحة.
        </p>

        <p>
          إذا انخفض عدد عمليات الري،
          يوصى بمراجعة خطة الري.
        </p>

        <p>
          متابعة التسميد بشكل دوري
          لتحسين الإنتاجية.
        </p>

      </Card>

      <Button>
        إنشاء تقرير PDF
      </Button>

    </div>

  );

}
