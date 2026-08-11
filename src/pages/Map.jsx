import useMap from "../hooks/useMap";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Map() {
  const {
    farms,
    locations,

    farmId,
    setFarmId,

    locationType,
    setLocationType,

    latitude,
    longitude,

    accuracy,
    locationTime,

    notes,
    setNotes,

    loading,

    getCurrentLocation,
    addLocation,
    deleteLocation,
  } = useMap();

  return (
    <div>
      <h1>
        📍 نظام المواقع الذكي
      </h1>

      <Card title="تسجيل موقع جديد">
        <select
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm) => (
            <option
              key={farm.id}
              value={farm.id}
            >
              {farm.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <select
          value={locationType}
          onChange={(e) =>
            setLocationType(e.target.value)
          }
        >
          <option>
            مزرعة
          </option>

          <option>
            حقل
          </option>

          <option>
            مصدر مياه
          </option>
        </select>

        <br />
        <br />

        <Button
          onClick={getCurrentLocation}
        >
          {loading
            ? "⏳ جاري تحديد الموقع..."
            : "📡 تحديد GPS"}
        </Button>

        <br />
        <br />

        <input
          value={latitude}
          readOnly
          placeholder="Latitude"
        />

        <br />
        <br />

        <input
          value={longitude}
          readOnly
          placeholder="Longitude"
        />

        <br />
        <br />

        <input
          value={
            accuracy
              ? `${accuracy} متر`
              : ""
          }
          readOnly
          placeholder="Accuracy"
        />

        <br />
        <br />

        <input
          value={locationTime}
          readOnly
          placeholder="وقت التسجيل"
        />

        <br />
        <br />

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="ملاحظات الموقع"
        />

        <br />
        <br />

        <Button onClick={addLocation}>
          💾 حفظ الموقع
        </Button>
      </Card>

      <h2>
        🗺️ المواقع المحفوظة
      </h2>

      {locations.map((item) => (
        <Card
          key={item.id}
          title={item.farmName}
        >
          <p>
            📌 النوع: {item.type}
          </p>

          <p>
            🌍 Latitude: {item.latitude}
          </p>

          <p>
            🌍 Longitude: {item.longitude}
          </p>

          <p>
            🎯 الدقة: {item.accuracy} متر
          </p>

          <p>
            📝 الملاحظات: {item.notes}
          </p>

          <a
            href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            🗺️ فتح في Google Maps
          </a>

          <br />
          <br />

          <Button
            onClick={() =>
              deleteLocation(item.id)
            }
          >
            حذف
          </Button>
        </Card>
      ))}
    </div>
  );
}
