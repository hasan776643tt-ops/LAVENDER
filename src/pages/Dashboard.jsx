import { useContext, useMemo } from "react";

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



  const statistics = useMemo(() => [

    {
      title: "🌾 المزارع",
      value: farms.length,
      description: "إجمالي المزارع المسجلة",
    },

    {
      title: "🌱 الحقول",
      value: fields.length,
      description: "إجمالي الحقول",
    },

    {
      title: "🌿 المحاصيل",
      value: crops.length,
      description: "إجمالي المحاصيل",
    },

    {
      title: "💧 الري",
      value: irrigations.length,
      description: "عمليات الري",
    },

    {
      title: "🌾 الأسمدة",
      value: fertilizers.length,
      description: "عمليات التسميد",
    },

    {
      title: "🧪 المبيدات",
      value: pesticides.length,
      description: "عمليات الرش",
    },

    {
      title: "🦠 الأمراض",
      value: diseases.length,
      description: "الأمراض المسجلة",
    },

    {
      title: "📍 المواقع",
      value: locations.length,
      description: "مواقع GPS",
    },

    {
      title: "👤 المستخدمون",
      value: users.length,
      description: "المستخدمون",
    },

    {
      title: "💰 المصاريف",
      value: expenses.length,
      description: "السجلات المالية",
    },

  ], [

    farms,
    fields,
    crops,
    irrigations,
    fertilizers,
    pesticides,
    diseases,
    locations,
    users,
    expenses,

  ]);



  const totalActivities =
    farms.length +
    fields.length +
    crops.length +
    irrigations.length +
    fertilizers.length +
    pesticides.length +
    diseases.length;



  return (

    <div>


      <h1>
        📊 لوحة التحكم الذكية
      </h1>


      <p>
        متابعة جميع أنظمة LAVENDER Smart Farm
      </p>



      <Card title="🚀 مؤشرات الأداء">

        <h2>
          {totalActivities}
        </h2>

        <p>
          إجمالي العمليات الزراعية
        </p>

      </Card>



      {
        statistics.map((item) => (

          <Card
            key={item.title}
            title={item.title}
          >

            <h2>
              {item.value}
            </h2>

            <p>
              {item.description}
            </p>

          </Card>

        ))
      }



      <Card title="🔔 المتابعة الذكية">

        <p>
          متابعة مواعيد الري القادمة.
        </p>

        <p>
          مراقبة الأمراض والآفات.
        </p>

        <p>
          تحليل أداء المزرعة مستقبلاً بالذكاء الاصطناعي.
        </p>

      </Card>



      <Card title="🌱 حالة النظام">

        <p>
          البيانات محفوظة محليًا عبر LocalStorage.
        </p>

        <p>
          النظام جاهز للانتقال لاحقًا إلى قاعدة بيانات حقيقية.
        </p>

      </Card>


    </div>

  );

}
