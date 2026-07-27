import {
  useContext,
  useState,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function AI() {


  const {

    farms = [],
    fields = [],
    crops = [],
    consultations = [],
    setConsultations,

  } = useContext(FarmContext);



  const [farm,setFarm] =
    useState("");

  const [field,setField] =
    useState("");

  const [crop,setCrop] =
    useState("");

  const [stage,setStage] =
    useState("");

  const [category,setCategory] =
    useState("");

  const [severity,setSeverity] =
    useState("متوسطة");

  const [question,setQuestion] =
    useState("");





  const generateAnswer = () => {


    if(category === "مرض نباتي") {

      return "افحص الأوراق والجذور، سجل الأعراض، وابدأ بالمقارنة مع الأمراض الشائعة. يفضل مراجعة برنامج المكافحة.";

    }


    if(category === "آفة حشرية") {

      return "راقب نسبة الإصابة، حدد نوع الحشرة، واستخدم برنامج مكافحة مناسب حسب مرحلة المحصول.";

    }


    if(category === "ري") {

      return "راجع رطوبة التربة ومرحلة نمو المحصول، ثم عدل كمية ومواعيد الري.";

    }


    if(category === "تسميد") {

      return "تحقق من احتياجات المحصول الغذائية وأضف السماد حسب التحليل والمرحلة الزراعية.";

    }


    if(category === "إنتاجية") {

      return "راجع الصنف، الكثافة النباتية، الري، التسميد، ومشاكل الأمراض لتحسين الإنتاج.";

    }


    return "تم تسجيل المشكلة. سيتم تحليلها بشكل أعمق عند ربط النظام بالذكاء الاصطناعي الحقيقي.";

  };







  const askAI = () => {


    if(!question) {

      alert("اكتب المشكلة أولاً");

      return;

    }



    const newConsultation = {


      id:
        Date.now(),


      farm,

      field,

      crop,

      stage,

      category,

      severity,


      question,


      answer:
        generateAnswer(),


      source:
        "🤖 ذكاء اصطناعي",


      date:
        new Date()
        .toLocaleString("ar"),


    };



    setConsultations([

      newConsultation,

      ...consultations,

    ]);



    setFarm("");

    setField("");

    setCrop("");

    setStage("");

    setCategory("");

    setQuestion("");

  };







  const deleteConsultation = (id)=>{


    setConsultations(

      consultations.filter(

        item =>
          item.id !== id

      )

    );

  };






  return (

    <div>


      <h1>
        🤖 المستشار الزراعي الذكي
      </h1>


      <p>
        نظام تحليل زراعي ذكي جاهز للربط مع الذكاء الاصطناعي الحقيقي.
      </p>





      <Card title="🌱 إنشاء استشارة جديدة">


        <select

          value={farm}

          onChange={(e)=>
            setFarm(e.target.value)
          }

        >

          <option value="">
            اختر المزرعة
          </option>


          {farms.map(item=>(

            <option
              key={item.id}
              value={item.name}
            >

              {item.name}

            </option>

          ))}


        </select>



        <br/><br/>




        <select

          value={field}

          onChange={(e)=>
            setField(e.target.value)
          }

        >

          <option value="">
            اختر الحقل
          </option>


          {fields.map(item=>(

            <option
              key={item.id}
              value={item.name}
            >

              {item.name}

            </option>

          ))}


        </select>



        <br/><br/>





        <select

          value={crop}

          onChange={(e)=>
            setCrop(e.target.value)
          }

        >

          <option value="">
            اختر المحصول
          </option>


          {crops.map(item=>(

            <option
              key={item.id}
              value={item.name}
            >

              {item.name}

            </option>

          ))}


        </select>



        <br/><br/>





        <input

          placeholder="مرحلة النمو"

          value={stage}

          onChange={(e)=>
            setStage(e.target.value)
          }

        />



        <br/><br/>





        <select

          value={category}

          onChange={(e)=>
            setCategory(e.target.value)
          }

        >

          <option value="">
            نوع المشكلة
          </option>

          <option>
            مرض نباتي
          </option>

          <option>
            آفة حشرية
          </option>

          <option>
            ري
          </option>

          <option>
            تسميد
          </option>

          <option>
            إنتاجية
          </option>


        </select>



        <br/><br/>





        <select

          value={severity}

          onChange={(e)=>
            setSeverity(e.target.value)
          }

        >

          <option>
            منخفضة
          </option>

          <option>
            متوسطة
          </option>

          <option>
            عالية
          </option>


        </select>



        <br/><br/>





        <textarea

          placeholder="اكتب وصف المشكلة أو الأعراض"

          value={question}

          onChange={(e)=>
            setQuestion(e.target.value)
          }

        />



        <br/><br/>





        <Button onClick={askAI}>

          🤖 تحليل المشكلة

        </Button>



      </Card>








      <Card title="📚 سجل الاستشارات">


      {

        consultations.map(item=>(


          <Card

            key={item.id}

            title={
              item.crop ||
              "استشارة زراعية"
            }

          >


            <p>
              🌱 المحصول:
              {" "}
              {item.crop}
            </p>


            <p>
              📂 النوع:
              {" "}
              {item.category}
            </p>


            <p>
              ⚠️ الخطورة:
              {" "}
              {item.severity}
            </p>


            <p>
              ❓ المشكلة:
              {" "}
              {item.question}
            </p>


            <p>
              💡 التحليل:
              {" "}
              {item.answer}
            </p>


            <p>
              🤖 المصدر:
              {" "}
              {item.source}
            </p>


            <p>
              📅 التاريخ:
              {" "}
              {item.date}
            </p>



            <Button

              onClick={()=>
                deleteConsultation(item.id)
              }

            >

              حذف

            </Button>



          </Card>


        ))

      }


      </Card>




    </div>

  );

}
