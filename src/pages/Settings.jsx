import { useState } from "react";

export default function Settings() {

  const [farmName, setFarmName] = useState("");

  const [language, setLanguage] = useState("العربية");

  const [notifications, setNotifications] = useState(true);


  const saveSettings = () => {

    alert("تم حفظ الإعدادات");

  };


  return (
    <div>

      <h1>⚙️ إعدادات النظام</h1>


      <h2>
        إعدادات المزرعة
      </h2>


      <label>
        اسم المزرعة
      </label>

      <br />

      <input

        type="text"

        placeholder="اكتب اسم المزرعة"

        value={farmName}

        onChange={(e)=>setFarmName(e.target.value)}

      />


      <br /><br />



      <label>
        اللغة
      </label>

      <br />


      <select

        value={language}

        onChange={(e)=>setLanguage(e.target.value)}

      >

        <option>
          العربية
        </option>

        <option>
          English
        </option>


      </select>



      <br /><br />



      <label>

        <input

          type="checkbox"

          checked={notifications}

          onChange={(e)=>setNotifications(e.target.checked)}

        />

        تفعيل الإشعارات

      </label>



      <br /><br />



      <button onClick={saveSettings}>

        حفظ الإعدادات

      </button>



      <hr />



      <h2>
        معلومات النظام
      </h2>


      <p>
        🌱 Smart Farm Management
      </p>


      <p>
        نظام إدارة المزارع الذكية
      </p>


    </div>
  );
}
