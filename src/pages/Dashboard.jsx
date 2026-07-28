// src/pages/Dashboard.jsx

import {
  useContext,
  useMemo,
} from "react";

import {
  FarmContext
} from "../context/FarmContext";

import Card from "../components/Card";


export default function Dashboard() {


  const {

    farms = [],
    fields = [],
    crops = [],
    irrigations = [],
    fertilizers = [],
    pesticides = [],
    diseases = [],
    expenses = [],
    harvests = [],
    inventory = [],

  } = useContext(FarmContext);






  const statistics = useMemo(()=>[


    {
      title:"🌾 المزارع",
      value:farms.length,
      info:"عدد المزارع"
    },


    {
      title:"🌱 الحقول",
      value:fields.length,
      info:"عدد الحقول"
    },


    {
      title:"🌿 المحاصيل",
      value:crops.length,
      info:"المحاصيل المزروعة"
    },


    {
      title:"💧 الري",
      value:irrigations.length,
      info:"عمليات الري"
    },


    {
      title:"🧪 المبيدات",
      value:pesticides.length,
      info:"عمليات الرش"
    },


    {
      title:"🌾 الأسمدة",
      value:fertilizers.length,
      info:"عمليات التسميد"
    },


    {
      title:"🦠 الأمراض",
      value:diseases.length,
      info:"الحالات المرضية"
    },


    {
      title:"💰 المصاريف",
      value:expenses.length,
      info:"السجلات المالية"
    },


    {
      title:"📦 المخزون",
      value:inventory.length,
      info:"مواد المخزون"
    },


    {
      title:"🚜 الحصاد",
      value:harvests.length,
      info:"عمليات الحصاد"
    },


  ],[

    farms,
    fields,
    crops,
    irrigations,
    fertilizers,
    pesticides,
    diseases,
    expenses,
    harvests,
    inventory,

  ]);








  const totalOperations = useMemo(()=>{


    return (

      farms.length +
      fields.length +
      crops.length +
      irrigations.length +
      fertilizers.length +
      pesticides.length +
      diseases.length +
      expenses.length

    );


  },[

    farms,
    fields,
    crops,
    irrigations,
    fertilizers,
    pesticides,
    diseases,
    expenses,

  ]);







  const smartStatus = useMemo(()=>{


    if(diseases.length > 0)

      return "⚠️ يوجد حالات مرضية تحتاج متابعة";


    if(pesticides.length > 0)

      return "🧪 يوجد عمليات رش مسجلة";


    if(irrigations.length > 0)

      return "💧 نظام الري يعمل بشكل جيد";


    return "🌱 النظام يحتاج إدخال بيانات جديدة";


  },[

    diseases,
    pesticides,
    irrigations,

  ]);







  return (

    <div>


      <h1>
        📊 لوحة التحكم الذكية
      </h1>



      <p>
        LAVENDER Smart Farm
        - إدارة ومراقبة المزرعة
      </p>







      <Card title="🚀 الأداء العام">


        <h2>
          {totalOperations}
        </h2>


        <p>
          إجمالي العمليات الزراعية
        </p>


      </Card>









      <Card title="🤖 الحالة الذكية">


        <p>
          {smartStatus}
        </p>


      </Card>









      {

        statistics.map(item=>(


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


        ))

      }









      <Card title="🌱 جاهزية النظام">


        <p>
          ✅ إدارة البيانات تعمل
        </p>


        <p>
          ✅ LocalStorage فعال
        </p>


        <p>
          ✅ جاهز للربط مع قاعدة بيانات سحابية
        </p>


        <p>
          ✅ جاهز لإضافة الذكاء الاصطناعي
        </p>


      </Card>





    </div>

  );


}
