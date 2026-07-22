export default function Expenses() {
  return (
    <div>
      <h1>💰 إدارة المصاريف</h1>

      <p>
        من هنا يمكن تسجيل جميع مصاريف المزرعة.
      </p>

      <h2>إضافة مصروف جديد</h2>

      <label>نوع المصروف</label>
      <br />
      <input
        type="text"
        placeholder="بذور، سماد، وقود..."
      />

      <br /><br />

      <label>القيمة</label>
      <br />
      <input
        type="number"
        placeholder="أدخل المبلغ"
      />

      <br /><br />

      <label>التاريخ</label>
      <br />
      <input type="date" />

      <br /><br />

      <label>ملاحظات</label>
      <br />
      <textarea
        placeholder="أدخل أي ملاحظات"
      ></textarea>

      <br /><br />

      <button>
        حفظ المصروف
      </button>
    </div>
  );
}
