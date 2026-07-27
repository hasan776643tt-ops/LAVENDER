import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Engineer() {


  const {

    farms = [],
    fields = [],
    consultations = [],
    setConsultations,

  } = useContext(FarmContext);




  const initialForm = {

    farm:"",
    field:"",
    crop:"",
    specialization:"",
    priority:"متوسطة",
    problem:"",
    status:"جديدة",
    source:"👨‍🌾 مهندس زراعي",
    createdAt:"",

  };



  const [form,setForm] =
    useState(initialForm);



  const [filter,setFilter] =
    useState("الكل");




  const updateForm = (
    key,
    value
  ) => {


    setForm(prev => ({

      ...prev,

      [key]:value,

    }));

  };






  const filteredFields =
    useMemo(()=>{


      if(!form.farm)

        return fields;



      return fields.filter(

        field =>

        field.farm === form.farm ||

        field.farmName === form.farm

      );


    },[

      fields,

      form.farm

    ]);








  const sendConsultation = () => {


    if(

      !form.farm ||

      !form.problem

    ){

      alert(
        "اختر المزرعة واكتب المشكلة"
      );

      return;

    }




    const newConsultation = {


      id:

      Date.now(),


      ...form,


      createdAt:

      new Date()

      .toLocaleString("ar"),


      updatedAt:

      new Date()

      .toLocaleString("ar"),


    };




    setConsultations([

      newConsultation,

      ...consultations,

    ]);




    setForm(initialForm);


  };








  const deleteConsultation = (id)=>{


    setConsultations(

      consultations.filter(

        item =>

        item.id !== id

      )

    );


  };








  const displayedConsultations =

  filter === "الكل"

  ?

  consultations

  :

  consultations.filter(

    item =>

    item.status === filter

  );









  return (

    <div>


      <h1>
        👨‍🌾 نظام المهندس الزراعي الذكي
      </h1>


      <p>
        إرسال ومتابعة الاستشارات الزراعية
        بطريقة منظمة.
      </p>





      <Card title="📨 طلب استشارة جديدة">


        <select

          value={form.farm}

          onChange={(e)=>

            updateForm(
              "farm",
              e.target.value
            )

          }

        >

          <option value="">
            اختر المزرعة
          </option>


          {

          farms.map(farm=>(

            <option

              key={farm.id}

              value={farm.name}

            >

              {farm.name}

            </option>

          ))

          }


        </select>




        <br/><br/>




        <select

          value={form.field}

          onChange={(e)=>

            updateForm(
              "field",
              e.target.value
            )

          }

        >

          <option value="">
            اختر الحقل
          </option>


          {

          filteredFields.map(field=>(

            <option

              key={field.id}

              value={field.name}

            >

              {field.name}

            </option>

          ))

          }


        </select>




        <br/><br/>




        <input

          placeholder="اسم المحصول"

          value={form.crop}

          onChange={(e)=>

            updateForm(
              "crop",
              e.target.value
            )

          }

        />





        <br/><br/>




        <select

          value={form.specialization}

          onChange={(e)=>

            updateForm(
              "specialization",
              e.target.value
            )

          }

        >

          <option value="">
            تخصص المهندس
          </option>

          <option>
            أمراض نبات
          </option>

          <option>
            ري
          </option>

          <option>
            تسميد
          </option>

          <option>
            محاصيل
          </option>

          <option>
            آفات زراعية
          </option>


        </select>





        <br/><br/>




        <select

          value={form.priority}

          onChange={(e)=>

            updateForm(
              "priority",
              e.target.value
            )

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

          <option>
            عاجلة
          </option>


        </select>





        <br/><br/>




        <textarea

          placeholder="اكتب وصف المشكلة الزراعية"

          value={form.problem}

          onChange={(e)=>

            updateForm(
              "problem",
              e.target.value
            )

          }

        />





        <br/><br/>




        <Button

          onClick={sendConsultation}

        >

          📤 إرسال الطلب

        </Button>



      </Card>








      <Card title="📋 سجل الاستشارات">


        <select

          value={filter}

          onChange={(e)=>

            setFilter(
              e.target.value
            )

          }

        >

          <option>
            الكل
          </option>

          <option>
            جديدة
          </option>

          <option>
            قيد المراجعة
          </option>

          <option>
            تم الحل
          </option>


        </select>






        {

        displayedConsultations.map(item=>(


          <Card

            key={item.id}

            title={
              item.specialization ||
              "استشارة زراعية"
            }

          >


            <p>
              🔢 رقم الطلب:
              {" "}
              {item.id}
            </p>


            <p>
              🏡 المزرعة:
              {" "}
              {item.farm}
            </p>


            <p>
              🌱 المحصول:
              {" "}
              {item.crop}
            </p>


            <p>
              📂 التخصص:
              {" "}
              {item.specialization}
            </p>


            <p>
              🚨 الأولوية:
              {" "}
              {item.priority}
            </p>


            <p>
              ⚠️ المشكلة:
              {" "}
              {item.problem}
            </p>


            <p>
              📌 الحالة:
              {" "}
              {item.status}
            </p>


            <p>
              🕒 الإنشاء:
              {" "}
              {item.createdAt}
            </p>


            <Button

              onClick={()=> 
                deleteConsultation(item.id)
              }

            >

              حذف الطلب

            </Button>


          </Card>


        ))

        }


      </Card>



    </div>

  );

}
