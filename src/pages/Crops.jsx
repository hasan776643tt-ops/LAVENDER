export default function Crops() {
  return (
    <div>
      <h1>🌿 إدارة المحاصيل</h1>

      <p>
        من هنا يمكن متابعة المحاصيل المزروعة في الحقول.
      </p>

      <h2>إضافة محصول جديد</h2>

      <label>اسم المحصول</label>
      <br />
      <input
        type="text"
        placeholder="مثال: قمح، شعير، ذرة"
      />

      <br /><br />

      <label>تاريخ الزراعة</label>
      <br />
      <input type="date" />

      <br /><br />

      <label>الكمية المزروعة</label>
      <br />
      <input
        type="number"
        placeholder="أدخل الكمية"
      />

      <br /><br />

      <label>ملاحظات</label>
      <br />
      <textarea
        placeholder="أدخل أي ملاحظات عن المحصول"
      ></textarea>

      <br /><br />

      <button>
        حفظ المحصول
      </button>
    </div>
  );
}
