import { useState } from "react";

export default function AI() {

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);


  const askAI = () => {

    if (!question) return;


    const newConsultation = {

      id: Date.now(),

      question: question,

      answer:
        "سيتم تحليل السؤال وتقديم توصية زراعية ذكية بعد ربط النظام بالذكاء الاصطناعي الحقيقي.",

    };


    setAnswers([
      ...answers,
      newConsultation
    ]);


    setQuestion("");

  };


  const deleteConsultation = (id) => {

    const updatedAnswers =
      answers.filter(
        (item) => item.id !== id
      );

    setAnswers(updatedAnswers);

  };


  return (
    <div>

      <h1>🤖 المساعد الذكي الزراعي</h1>


      <p>
        اسأل المساعد الذكي عن مشاكل المحاصيل
        والأمراض وطرق العناية بالنبات.
      </p>


      <textarea

        placeholder="اكتب سؤالك الزراعي هنا..."

        value={question}

        onChange={(e)=>setQuestion(e.target.value)}

      />


      <br /><br />


      <button onClick={askAI}>
        إرسال السؤال
      </button>


      <hr />


      <h2>
        سجل الاستشارات
      </h2>


      <ul>

        {answers.map((item)=>(

          <li key={item.id}>

            <p>
              ❓ {item.question}
            </p>

            <p>
              💡 {item.answer}
            </p>


            <button
              onClick={()=>deleteConsultation(item.id)}
            >
              حذف
            </button>


          </li>

        ))}

      </ul>


    </div>
  );
}
