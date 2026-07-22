export default function Map() {
  return (
    <div>
      <h1>📍 خريطة المزارع</h1>

      <p>
        هذه الصفحة مخصصة لعرض مواقع المزارع والحقول على الخريطة.
      </p>

      <div
        style={{
          width: "100%",
          height: "300px",
          border: "2px solid gray",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🗺️ سيتم عرض الخريطة هنا لاحقاً
      </div>

      <br />

      <button>
        إضافة موقع مزرعة
      </button>
    </div>
  );
}
