import { useState } from "react";

import Card from "../components/Card";
import Button from "../components/Button";

export default function AI() {

  const [crop, setCrop] = useState("");
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");

  const [answers, setAnswers] = useState([]);

  const askAI = () => {

    if (!question) return;

    const newConsultation = {

      id: Date.now(),

      crop,

      category,

      question,

      answer:
        "توصية أولية: راقب الحقل خلال الأيام القادمة وقارن الأعراض مع برنامج الري والتسميد. سيتم مستقبلاً ربط هذه الصفحة بذكاء اصطناعي حقيقي لإعطاء تشخيصات أكثر دقة.",

      date:
        new Date().toLocaleDateString(),

    };

    setAnswers([
      newConsultation,
      ...answers,
    ]);

    setCrop("");
    setCategory("");
    setQuestion("");

  };

  const deleteConsultation = (id) => {

    setAnswers(
      answers.filter(
        (item) =>
          item.id !== id
      )
    );

  };

  return (

    <div>

      <h1>
        🤖 المستشار الزراعي الذكي
      </h1>

      <Card
        title="إرسال استشارة"
      >

        <input
          type="text"
          placeholder="اسم المحصول"
          value={crop}
          onChange={(e) =>
            setCrop(
              e.target.value
            )
          }
        />

        <br /><br />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >

          <option value="">
            نوع الاستشارة
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

          <option>
            أخرى
          </option>

        </select>

        <br /><br />

        <textarea
          placeholder="اكتب سؤالك أو وصف المشكلة"
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
        />

        <br /><br />

        <Button
          onClick={askAI}
        >
          تحليل المشكلة
        </Button>

      </Card>

      <h2>
        سجل الاستشارات
      </h2>

      {answers.map((item) => (

        <Card
          key={item.id}
          title={item.crop || "استشارة"}
        >

          <p>
            📂 التصنيف:
            {" "}
            {item.category}
          </p>

          <p>
            ❓ السؤال:
            {" "}
            {item.question}
          </p>

          <p>
            💡 التوصية:
            {" "}
            {item.answer}
          </p>

          <p>
            📅 التاريخ:
            {" "}
            {item.date}
          </p>

          <Button
            onClick={() =>
              deleteConsultation(
                item.id
              )
            }
          >
            حذف
          </Button>

        </Card>

      ))}

    </div>

  );

}
