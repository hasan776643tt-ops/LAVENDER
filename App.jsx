import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");

  return (
    <div>
      <h1>إدارة المزارع الذكية</h1>

      <p>أهلاً بك في المشروع</p>

      <input
        type="text"
        placeholder="اسم المزارع"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button>إضافة مزارع</button>

      <p>اسم المزارع: {name}</p>
    </div>
  );
}
