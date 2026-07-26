import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Engineer() {

  const { farms, fields } =
    useContext(FarmContext);

  const [farmName, setFarmName] =
    useState("");

  const [fieldName, setFieldName] =
    useState("");

  const [specialization, setSpecialization] =
    useState("");

  const [crop, setCrop] =
    useState("");

  const [priority, setPriority] =
    useState("متوسطة");

  const [problem, setProblem] =
    useState("");

  const [date, setDate] =
    useState("");

  const [consultations,
    setConsultations] = useState([]);

  const sendConsultation = () => {

    if (
      !farmName ||
      !fieldName ||
      !problem
    ) return;

    const newConsultation = {

      id: Date.now(),

      farm: farmName,

      field: fieldName,

      specialization,

      crop,

      priority,

      problem,

      date,

      status:
        "بانتظار رد المهندس",

    };

    setConsultations([
      ...consultations,
      newConsultation,
    ]);

    setFarmName("");
    setFieldName("");
    setSpecialization("");
    setCrop("");
    setPriority("متوسطة");
    setProblem("");
    setDate("");

  };

  const deleteConsultation = (id) => {

    setConsultations(
      consultations.filter(
        (item) =>
          item.id !== id
      )
    );

  };

  return (

    <div>

      <h1>
        👨‍🌾 الاستشارات الزراعية
      </h1>

      <Card
        title="إرسال طلب استشارة"
      >

        <select
          value={farmName}
          onChange={(e) =>
            setFarmName(
              e.target.value
            )
          }
        >

          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm) => (

            <option
              key={farm.id}
              value={farm.name}
            >

              {farm.name}

            </option>

          ))}

        </select>

        <br /><br />

        <select
          value={fieldName}
          onChange={(e) =>
            setFieldName(
              e.target.value
            )
          }
        >

          <option value="">
            اختر الحقل
          </option>

          {fields.map((field) => (

            <option
              key={field.id}
              value={field.name}
            >

              {field.name}

            </option>

          ))}

        </select>

        <br /><br />

        <select
          value={specialization}
          onChange={(e) =>
            setSpecialization(
              e.target.value
            )
          }
        >

          <option value="">
            تخصص المهندس
          </option>

          <option>
            مهندس محاصيل
          </option>

          <option>
            مهندس ري
          </option>

          <option>
            مهندس تسميد
          </option>

          <option>
            مهندس أمراض نبات
          </option>

          <option>
            مهندس آفات
          </option>

        </select>

        <br /><br />

        <input
          type="text"
          placeholder="نوع المحصول"
          value={crop}
          onChange={(e) =>
            setCrop(
              e.target.value
            )
          }
        />

        <br /><br />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(
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

        <br /><br />

        <textarea
          placeholder="وصف المشكلة الزراعية"
          value={problem}
          onChange={(e) =>
            setProblem(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
        />

        <br /><br />

        <Button
          onClick={
            sendConsultation
          }
        >

          إرسال الاستشارة

        </Button>

      </Card>

      <h2>
        سجل الاستشارات
      </h2>

      {consultations.map(
        (item) => (

        <Card
          key={item.id}
          title={item.specialization}
        >

          <p>
            🏡 المزرعة:
            {" "}
            {item.farm}
          </p>

          <p>
            🌾 الحقل:
            {" "}
            {item.field}
          </p>

          <p>
            🌱 المحصول:
            {" "}
            {item.crop}
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
            📅 التاريخ:
            {" "}
            {item.date}
          </p>

          <p>
            🔔 الحالة:
            {" "}
            {item.status}
          </p>

          <Button
            onClick={() =>
              deleteConsultation(
                item.id
              )
            }
          >

            حذف الطلب

          </Button>

        </Card>

      ))}

    </div>

  );

}
