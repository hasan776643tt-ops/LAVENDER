import { useContext, useMemo } from "react";

import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


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
  } = useContext(FarmContext);



  // حساب إجمالي المصاريف
  const totalExpenses = useMemo(() => {

    return expenses.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

  }, [expenses]);



  // توصيات ذكية
  const recommendations = useMemo(() => {

    const result = [];


    if (diseases.length > 5) {

      result.push(
        "⚠️ يوجد ارتفاع في تسجيل الأمراض، يفضل مراجعة برنامج المكافحة."
      );

    }


    if (irrigations.length < fields.length) {

      result.push(
        "💧 بعض الحقول قد تحتاج إلى مراجعة خطة الري."
      );

    }


    if (fertilizers.length === 0) {

      result.push(
        "🌾 لم يتم تسجيل عمليات تسميد، راجع برنامج التغذية."
      );

    }


    if (result.length === 0) {

      result.push(
        "✅ حالة النظام جيدة ولا توجد تنبيهات حالياً."
      );

    }


    return result;

  }, [
    diseases,
    irrigations,
    fields,
    fertilizers
  ]);



  return (

    <div>


      <h1>
        📊 التقارير والإحصائيات الزراعية
      </h1>



      <Card title="📈 مؤشرات النظام">

        <div>

          <p>
            🌾 المزارع:
            {" "}
            <strong>{farms.length}</strong>
          </p>


          <p>
            📍 الحقول:
            {" "}
            <strong>{fields.length}</strong>
          </p>


          <p>
            🌱 المحاصيل:
            {" "}
            <strong>{crops.length}</strong>
          </p>


          <p>
            💧 عمليات الري:
            {" "}
            <strong>{irrigations.length}</strong>
          </p>


          <p>
            🌾 عمليات التسميد:
            {" "}
            <strong>{fertilizers.length}</strong>
          </p>


          <p>
            🧪 عمليات المبيدات:
            {" "}
            <strong>{pesticides.length}</strong>
          </p>


          <p>
            🦠 الأمراض:
            {" "}
            <strong>{diseases.length}</strong>
          </p>


          <p>
            💰 عدد المصاريف:
            {" "}
            <strong>{expenses.length}</strong>
          </p>


          <p>
            💵 إجمالي المصاريف:
            {" "}
            <strong>
              {totalExpenses}
            </strong>
          </p>


        </div>

      </Card>





      <Card title="📋 التقارير المتوفرة">


        <ul>

          <li>🌾 تقرير المزارع</li>

          <li>🌱 تقرير الحقول</li>

          <li>🌿 تقرير المحاصيل</li>

          <li>💧 تقرير الري</li>

          <li>🌾 تقرير الأسمدة</li>

          <li>🧪 تقرير المبيدات</li>

          <li>🦠 تقرير الأمراض</li>

          <li>💰 تقرير المصاريف</li>


        </ul>


      </Card>





      <Card title="🤖 التوصيات الذكية">


        {
          recommendations.map(
            (item, index) => (

              <p key={index}>
                {item}
              </p>

            )
          )
        }


      </Card>





      <Card title="🚀 تطويرات مستقبلية">


        <p>
          📊 رسوم بيانية للإنتاج والمصاريف.
        </p>


        <p>
          📄 تصدير PDF و Excel.
        </p>


        <p>
          ☁️ ربط قاعدة بيانات حقيقية.
        </p>


        <p>
          🤖 تحليل ذكي للمزرعة.
        </p>


      </Card>





      <Button>

        إنشاء تقرير PDF

      </Button>



    </div>

  );

}
