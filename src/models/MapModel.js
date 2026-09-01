// =========================================================
// LAVENDER — MAP MODEL
// =========================================================
//
// النموذج الموحد لموقع الأرض.
//
// المصدر الحقيقي للموقع:
// latitude
// longitude
// points / boundary
//
// البيانات النصية الإدارية:
// country
// governorate
// district
// city
// village
// ...إلخ
//
// =========================================================

export const MapModel = Object.freeze({

  create(data = {}) {

    const points =
      Array.isArray(data.points)
        ? data.points
        : Array.isArray(data.boundary)
          ? data.boundary
          : [];

    const latitude =
      Number(data.latitude);

    const longitude =
      Number(data.longitude);

    return {

      id:
        data.id ?? null,

      farmId:
        data.farmId
          ? String(data.farmId)
          : "",

      farmName:
        String(
          data.farmName ?? ""
        ).trim(),

      source:
        data.source === "text"
          ? "text"
          : "map",

      type:
        data.type ||
        "field",

      status:
        data.status ||
        "active",

      // =====================================================
      // الموقع الحقيقي
      // =====================================================

      latitude:
        Number.isFinite(latitude)
          ? latitude
          : null,

      longitude:
        Number.isFinite(longitude)
          ? longitude
          : null,

      // =====================================================
      // حدود الأرض
      // =====================================================

      points,

      boundary:
        points,

      // =====================================================
      // القياسات
      // =====================================================

      area:
        Number.isFinite(
          Number(data.area)
        )
          ? Number(data.area)
          : null,

      perimeter:
        Number.isFinite(
          Number(data.perimeter)
        )
          ? Number(data.perimeter)
          : null,

      boundaryWidth:
        data.boundaryWidth ?? "",

      // =====================================================
      // البيانات الإدارية
      // =====================================================

      country:
        String(
          data.country ?? ""
        ).trim(),

      governorate:
        String(
          data.governorate ||
          data.state ||
          data.province ||
          data.region ||
          ""
        ).trim(),

      state:
        String(
          data.state ||
          data.governorate ||
          data.province ||
          data.region ||
          ""
        ).trim(),

      province:
        String(
          data.province ||
          data.governorate ||
          data.state ||
          data.region ||
          ""
        ).trim(),

      region:
        String(
          data.region ||
          data.governorate ||
          data.state ||
          data.province ||
          ""
        ).trim(),

      district:
        String(
          data.district ?? ""
        ).trim(),

      municipality:
        String(
          data.municipality ?? ""
        ).trim(),

      city:
        String(
          data.city ?? ""
        ).trim(),

      town:
        String(
          data.town ?? ""
        ).trim(),

      village:
        String(
          data.village ?? ""
        ).trim(),

      hamlet:
        String(
          data.hamlet ?? ""
        ).trim(),

      road:
        String(
          data.road ?? ""
        ).trim(),

      postcode:
        String(
          data.postcode ?? ""
        ).trim(),

      placeName:
        String(
          data.placeName ?? ""
        ).trim(),

      locationDescription:
        String(
          data.locationDescription ?? ""
        ).trim(),

      // =====================================================
      // الجوار
      // =====================================================

      northNeighbor:
        String(
          data.northNeighbor ||
          data.north ||
          ""
        ).trim(),

      southNeighbor:
        String(
          data.southNeighbor ||
          data.south ||
          ""
        ).trim(),

      eastNeighbor:
        String(
          data.eastNeighbor ||
          data.east ||
          ""
        ).trim(),

      westNeighbor:
        String(
          data.westNeighbor ||
          data.west ||
          ""
        ).trim(),

      notes:
        String(
          data.notes ?? ""
        ).trim(),

      // =====================================================
      // التواريخ
      // =====================================================

      createdAt:
        data.createdAt ||
        new Date().toISOString(),

      updatedAt:
        data.updatedAt ||
        null,
    };
  },

});
