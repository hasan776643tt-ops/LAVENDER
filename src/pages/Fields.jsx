export default function Fields() {
  return (
    <div>
      <h1>🌱 إدارة الحقول</h1>

      <p>
        من هنا يمكن للمزارع إضافة ومتابعة حقول المزرعة.
      </p>

      <h2>إضافة حقل جديد</h2>

      <label>اسم الحقل</label>
      <br />
      <input
        type="text"
        placeholder="اكتب اسم الحقل"
      />

      <br /><br />

      <label>المحصول</label>
      <br />
      <input
        type="text"
        placeholder="نوع المحصول"
      />

      <br /><br />

      <label>مساحة الحقل</label>
      <br />
      <input
        type="number"
        placeholder="بالهكتار أو المتر"
      />

      <br /><br />

      <label>تاريخ الزراعة</label>
      <br />
      <input
        type="date"
      />

      <br /><br />

      <button>
        حفظ الحقل
      </button>

    </div>
  );
}
