export default function Contact() {
  return (
    <div>
      <h1>تواصل معنا</h1>

      <form>
        <div>
          <label>الاسم</label>
          <br />
          <input type="text" placeholder="اكتب اسمك" />
        </div>

        <br />

        <div>
          <label>البريد الإلكتروني</label>
          <br />
          <input
            type="email"
            placeholder="example@email.com"
          />
        </div>

        <br />

        <div>
          <label>الرسالة</label>
          <br />
          <textarea
            rows="5"
            placeholder="اكتب رسالتك هنا"
          ></textarea>
        </div>

        <br />

        <button type="submit">
          إرسال
        </button>
      </form>
    </div>
  );
}
