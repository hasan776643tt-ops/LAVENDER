import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Diseases() {
  const {
    farms,
    fields,
    diseases,
    setDiseases,
  } = useContext(FarmContext);

  const [farmName, setFarmName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [problemType, setProblemType] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [severity, setSeverity] = useState("متوسطة");
  const [infectionRate, setInfectionRate] = useState("");
  const [discoveryDate, setDiscoveryDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");

  const addDisease = () => {
    if (!fieldName || !problemType) return;

    const newDisease = {
      id: Date.now(),
      farm: farmName,
      field: fieldName,
      type: problemType,
      name: diseaseName,
      severity,
      infectionRate,
      discoveryDate,
      symptoms,
      diagnosis,
      treatment,
    };

    setDiseases([...diseases, newDisease]);

    setFarmName("");
    setFieldName("");
    setProblemType("");
    setDiseaseName("");
    setSeverity("متوسطة");
    setInfectionRate("");
    setDiscoveryDate("");
    setSymptoms("");
    setDiagnosis("");
    setTreatment("");
  };

  const deleteDisease = (id) => {
    setDiseases(
      diseases.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div>

      <h1>🦠 إدارة الأمراض والآفات</h1>

      <Card title="إضافة إصابة جديدة">

        <select
          value={farmName}
          onChange={(e) =>
            setFarmName(e.target.value)
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
            setFieldName(e.target.value)
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
          value={problemType}
          onChange={(e) =>
            setProblemType(e.target.value)
          }
        >
          <option value="">
            نوع المشكلة
          </option>

          <option>
            مرض فطري
          </option>

          <option>
            حشرة
          </option>

          <option>
            نقص عناصر
          </option>

          <option>
            مشكلة ري
          </option>

          <option>
            غير معروف
          </option>

        </select>

        <br /><br />

        <input
          type="text"
          placeholder="اسم المرض أو الآفة"
          value={diseaseName}
          onChange={(e) =>
            setDiseaseName(e.target.value)
          }
        />

        <br /><br />

        <select
          value={severity}
          onChange={(e) =>
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

        <br /><br />

        <input
          type="number"
          placeholder="نسبة الإصابة %"
          value={infectionRate}
          onChange={(e) =>
            setInfectionRate(e.target.value)
          }
        />

        <br /><br />

        <input
          type="date"
          value={discoveryDate}
          onChange={(e) =>
            setDiscoveryDate(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="الأعراض"
          value={symptoms}
          onChange={(e) =>
            setSymptoms(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="التشخيص"
          value={diagnosis}
          onChange={(e) =>
            setDiagnosis(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="العلاج"
          value={treatment}
          onChange={(e) =>
            setTreatment(e.target.value)
          }
        />

        <br /><br />

        <Button onClick={addDisease}>
          حفظ الإصابة
        </Button>

      </Card>

      <h2>سجل الأمراض</h2>

      {diseases.map((item) => (

        <Card
          key={item.id}
          title={item.name || item.type}
        >

          <p>
            🏡 المزرعة: {item.farm}
          </p>

          <p>
            🌾 الحقل: {item.field}
          </p>

          <p>
            🦠 النوع: {item.type}
          </p>

          <p>
            ⚠️ الخطورة: {item.severity}
          </p>

          <p>
            📊 نسبة الإصابة:
            {" "}
            {item.infectionRate}%
          </p>

          <p>
            📅 تاريخ الاكتشاف:
            {" "}
            {item.discoveryDate}
          </p>

          <p>
            🔍 الأعراض:
            {" "}
            {item.symptoms}
          </p>

          <p>
            🧪 التشخيص:
            {" "}
            {item.diagnosis}
          </p>

          <p>
            💊 العلاج:
            {" "}
            {item.treatment}
          </p>

          <Button
            onClick={() =>
              deleteDisease(item.id)
            }
          >
            حذف الإصابة
          </Button>

        </Card>

      ))}

    </div>
  );
}
