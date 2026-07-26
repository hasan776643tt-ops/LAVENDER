import {
  useContext,
  useMemo,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

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



  // 💰 إجمالي المصاريف

  const totalExpenses = useMemo(() => {

    return expenses.reduce(

      (sum,item)=>

        sum + Number(item.amount || 0),

      0

    );

  },[expenses]);





  // 🌿 أكثر محصول

  const topCrop = useMemo(()=>{


    const counter = {};


    crops.forEach(crop=>{

      const name =
        crop.name || "غير محدد";


      counter[name] =
        (counter[name] || 0) + 1;


    });


    return Object.keys(counter)
      .sort(
        (a,b)=>
          counter[b]-counter[a]
      )[0]
      ||
      "لا يوجد";


  },[crops]);







  // 💰 أكثر نوع مصروف

  const topExpense = useMemo(()=>{


    const counter = {};


    expenses.forEach(item=>{

      const type =
        item.type || "أخرى";


      counter[type] =
        (counter[type] || 0)+1;


    });


    return Object.keys(counter)
      .sort(
        (a,b)=>
        counter[b]-counter[a]
      )[0]
      ||
      "لا يوجد";


  },[expenses]);








  // 🤖 توصيات ذكية

  const recommendations = useMemo(()=>{


    const list=[];



    if(diseases.length >= 5){

      list.push(
        "🦠 ارتفاع تسجيل الأمراض، يفضل مراجعة خطة المكافحة."
      );

    }



    if(fields.length > irrigations.length){

      list.push(
        "💧 عدد عمليات الري أقل من عدد الحقول، راجع الجدول."
      );

    }



    if(fertilizers.length === 0){

      list.push(
        "🌾 لم يتم تسجيل تسميد، أضف خطة تغذية للمحاصيل."
      );

    }



    if(expenses.length > 20){

      list.push(
        "💰 عدد المصاريف مرتفع، راجع التكاليف."
      );

    }



    if(list.length===0){

      list.push(
        "✅ حالة المزرعة مستقرة حالياً."
      );

    }


    return list;


  },[

    diseases,
    fields,
    irrigations,
    fertilizers,
    expenses

  ]);






  return (

    <div>


      <h1>
        📊 لوحة التقارير الذكية
      </h1>



      <Card title="🚜 مؤشرات النظام">


        <p>
          🌾 المزارع:
          <strong>
            {" "}
            {farms.length}
          </strong>
        </p>


        <p>
          📍 الحقول:
          <strong>
            {" "}
            {fields.length}
          </strong>
        </p>


        <p>
          🌱 المحاصيل:
          <strong>
            {" "}
            {crops.length}
          </strong>
        </p>


        <p>
          💧 عمليات الري:
          <strong>
            {" "}
            {irrigations.length}
          </strong>
        </p>


        <p>
          🦠 الأمراض:
          <strong>
            {" "}
            {diseases.length}
          </strong>
        </p>


      </Card>





      <Card title="💰 التحليل المالي">


        <p>
          إجمالي المصاريف:
          <strong>
            {" "}
            {totalExpenses}
          </strong>
        </p>


        <p>
          عدد العمليات:
          <strong>
            {" "}
            {expenses.length}
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







      <Card title="🌿 تحليل المحاصيل">


        <p>
          أكثر محصول:
          <strong>
            {" "}
            {topCrop}
          </strong>
        </p>


        <p>
          عدد المحاصيل المسجلة:
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







      <Card title="🚀 التطوير القادم">


        <p>
          📈 رسوم بيانية زراعية.
        </p>


        <p>
          📄 تصدير PDF و Excel.
        </p>


        <p>
          ☀️ ربط الطقس الحقيقي.
        </p>


        <p>
          🤖 تحليل ذكي متقدم.
        </p>


      </Card>







      <Button>

        إنشاء تقرير PDF

      </Button>



    </div>

  );


}
