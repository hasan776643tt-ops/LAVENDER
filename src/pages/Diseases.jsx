import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Diseases() {
  const { diseases, setDiseases } =
    useContext(FarmContext);

  const [diseaseName, setDiseaseName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [followUp, setFollowUp] = useState("");

  const addDisease = () => {
    if (!diseaseName) return;

    const newDisease = {
      id: Date.now(),
      name: diseaseName,
      field: fieldName,
      symptoms: symptoms,
      diagnosis: diagnosis,
      treatment: treatment,
      followUp: followUp,
    };

    setDiseases([
      ...diseases,
      newDisease,
    ]);

    setDiseaseName("");
    setFieldName("");
    setSymptoms("");
    setDiagnosis("");
    setTreatment("");
    setFollowUp("");
  };

  const deleteDisease = (id) => {
    const updatedDiseases =
      diseases.filter(
        (item) => item.id !== id
      );

    setDiseases(updatedDiseases);
  };

  return (
    <div>
      <h1>🦠 إدارة الأمراض والآفات</h1>

      <h2>إضافة إصابة جديدة</h2>

      <input
        type="text"
        placeholder="اسم المرض أو الآفة"
        value={diseaseName}
        onChange={(e) => setDiseaseName(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="الحقل المصاب"
        value={fieldName}
        onChange={(e) => setFieldName(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="وصف الأعراض"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="التشخيص"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="العلاج"
        value={treatment}
        onChange={(e) => setTreatment(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={followUp}
        onChange={(e) => setFollowUp(e.target.value)}
      />

      <br /><br />

      <button onClick={addDisease}>
        حفظ الإصابة
      </button>

      <hr />

      <h2>سجل الأمراض</h2>

      <ul>
        {diseases.map((item) => (
          <li key={item.id}>
            🦠 {item.name}
            {" - "}
            الحقل: {item.field}

            <button
              onClick={() => deleteDisease(item.id)}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
