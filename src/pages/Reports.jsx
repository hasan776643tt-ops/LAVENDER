import {
  useContext,
  useMemo,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import {
  useSettings,
} from "../context/SettingsContext";

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
    consultations = [],
    aiQuestions = [],

  } = useContext(FarmContext);



  const {
    settings,
  } = useSettings();





  // 💰 إجمالي المصاريف

  const totalExpenses = useMemo(() => {

    return expenses.reduce(

      (sum, item) =>

        sum + Number(item.amount || 0),

      0

    );

  }, [expenses]);





  // 📊 إجمالي الأنشطة

  const totalActivities = useMemo(() => {

    return (

      farms.length +
      fields.length +
      crops.length +
      irrigations.length +
      fertilizers.length +
      pesticides.length +
      diseases.length

    );

  }, [

    farms,
    fields,
    crops,
    irrigations,
    fertilizers,
    pesticides,
    diseases,

  ]);





  // 💰 متوسط المصاريف

  const averageExpense = useMemo(() => {

    if (!expenses.length)
      return 0;


    return Math.round(
      totalExpenses / expenses.length
    );


  }, [

    totalExpenses,
    expenses,

  ]);





  // 🌿 أكثر محصول

  const topCrop = useMemo(() => {


    const counter = {};


    crops.forEach((crop)=>{


      const name =
        crop.name || "غير محدد";


      counter[name] =
        (counter[name] || 0) + 1;


    });



    return (

      Object.keys(counter)
      .sort(
        (a,b)=>
        counter[b]-counter[a]
      )[0]

      ||

      "لا يوجد"

    );


  }, [crops]);





  // 💰 أكثر نوع مصروف

  const topExpense = useMemo(() => {


    const counter = {};



    expenses.forEach((item)=>{


      const type =
        item.type || "أخرى";


      counter[type] =
        (counter[type] || 0)+1;


    });



    return (

      Object.keys(counter)
      .sort(
        (a,b)=>
        counter[b]-counter[a]
      )[0]

      ||

      "لا يوجد"

    );


  }, [expenses]);






  // 🤖 التوصيات الذكية

  const recommendations = useMemo(()=>{


    const list = [];



    if(diseases.length > 0){

      list.push(
        "🦠 يوجد سجل أمراض، راجع حالة المحاصيل باستمرار."
      );

    }



    if(fields.length > irrigations.length){

      list.push(
        "💧 بعض الحقول قد تحتاج إلى جدولة ري جديدة."
      );

    }



    if(fertilizers.length === 0){

      list.push(
        "🌾 لم يتم تسجيل عمليات تسميد بعد."
      );

    }



    if(expenses.length > 10){

      list.push(
        "💰 راجع المصاريف لتحسين إدارة التكاليف."
      );

    }



    if(list.length === 0){

      list.push(
        "✅ حالة النظام مستقرة."
      );

    }



    return list;


  },[

    diseases,
    fields,
    irrigations,
    fertilizers,
    expenses,

  ]);





  return (

    <div>


      <h1>
        📊 التقارير الذكية
      </h1>


      <p>
        تحليل شامل لنظام LAVENDER Smart Farm
      </p>





      <Card title="🚀 مؤشرات الأداء KPI">


        <p>
          إجمالي الأنشطة:
          <strong>
            {" "}
            {totalActivities}
          </strong>
        </p>


        <p>
          عدد المزارع:
          <strong>
            {" "}
            {farms.length}
          </strong>
        </p>


        <p>
          عدد الحقول:
          <strong>
            {" "}
            {fields.length}
          </strong>
        </p>


        <p>
          عدد المحاصيل:
          <strong>
            {" "}
            {crops.length}
          </strong>
        </p>


      </Card>





      <Card title="💰 التقرير المالي">


        <p>
          إجمالي المصاريف:
          <strong>
            {" "}
            {totalExpenses}
            {" "}
            {settings.currency}
          </strong>
        </p>


        <p>
          متوسط المصروف:
          <strong>
            {" "}
            {averageExpense}
            {" "}
            {settings.currency}
          </strong>
        </p>


        <p>
          أكثر نوع مصروف:
          <strong>
            {" "}
            {topExpense}
          </strong>
        </p>


      </Card>





      <Card title="🌱 تحليل المحاصيل">


        <p>
          أكثر محصول:
          <strong>
            {" "}
            {topCrop}
          </strong>
        </p>


        <p>
          عدد المحاصيل:
          <strong>
            {" "}
            {crops.length}
          </strong>
        </p>


      </Card>





      <Card title="🤖 التوصيات الذكية">


        {
          recommendations.map(
            (item,index)=>(

              <p key={index}>
                {item}
              </p>

            )
          )
        }


      </Card>





      <Card title="👨‍🌾 النشاط الذكي">


        <p>
          الاستشارات:
          {" "}
          {consultations.length}
        </p>


        <p>
          أسئلة الذكاء الاصطناعي:
          {" "}
          {aiQuestions.length}
        </p>


      </Card>





      <Card title="📈 التطوير المستقبلي">


        <p>
          📄 تصدير PDF و Excel
        </p>


        <p>
          📊 رسوم بيانية وتحليلات متقدمة
        </p>


        <p>
          🤖 تنبؤات زراعية بالذكاء الاصطناعي
        </p>


      </Card>





      <Button>

        إنشاء تقرير PDF

      </Button>



    </div>

  );

}
