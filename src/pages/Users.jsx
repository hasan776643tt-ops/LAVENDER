export default function Users() {
  return (
    <div>
      <h1>👤 إدارة المستخدمين</h1>

      <p>
        من هنا يمكن إدارة جميع مستخدمي النظام.
      </p>

      <h2>إضافة مستخدم جديد</h2>

      <label>الاسم</label>
      <br />
      <input
        type="text"
        placeholder="أدخل اسم المستخدم"
      />

      <br /><br />

      <label>البريد الإلكتروني</label>
      <br />
      <input
        type="email"
        placeholder="أدخل البريد الإلكتروني"
      />

      <br /><br />

      <label>نوع المستخدم</label>
      <br />
      <select>
        <option>مزارع</option>
        <option>مهندس زراعي</option>
        <option>مشرف</option>
        <option>مدير النظام</option>
      </select>

      <br /><br />

      <button>
        حفظ المستخدم
      </button>
    </div>
  );
}
