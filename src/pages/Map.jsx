// =========================================================
// GPS AREA STYLE — FIXED CENTER BOUNDARY SELECTOR
// =========================================================

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


// ---------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------

const DEFAULT_POSITION = [36.7, 38.7];
const DEFAULT_ZOOM = 18;


// ---------------------------------------------------------
// NORMALIZE POINT
// ---------------------------------------------------------

function normalizePoint(point) {
  if (!Array.isArray(point) || point.length < 2) {
    return null;
  }

  const lat = Number(point[0]);
  const lng = Number(point[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return [lat, lng];
}


// ---------------------------------------------------------
// CENTER TRACKER
// ---------------------------------------------------------

function MapCenterTracker({
  centerRef,
  onCenterChange,
}) {
  const map = useMap();

  useEffect(() => {

    const updateCenter = () => {

      const center = map.getCenter();

      const point = [
        center.lat,
        center.lng,
      ];

      centerRef.current = point;

      if (onCenterChange) {
        onCenterChange(point);
      }
    };

    updateCenter();

    map.on("move", updateCenter);

    return () => {
      map.off("move", updateCenter);
    };

  }, [map, centerRef, onCenterChange]);

  return null;
}


// ---------------------------------------------------------
// FIXED CENTER CROSSHAIR
// ---------------------------------------------------------

function FixedCenterTarget() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 58,
        height: 58,
        zIndex: 10000,
        pointerEvents: "none",
      }}
    >

      {/* horizontal */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 2,
          transform: "translateY(-50%)",
          background: "#ffffff",
          boxShadow: "0 0 3px rgba(0,0,0,.9)",
        }}
      />

      {/* vertical */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 2,
          transform: "translateX(-50%)",
          background: "#ffffff",
          boxShadow: "0 0 3px rgba(0,0,0,.9)",
        }}
      />

      {/* outer circle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 18,
          height: 18,
          transform: "translate(-50%, -50%)",
          border: "3px solid #ffffff",
          borderRadius: "50%",
          boxShadow: "0 0 4px rgba(0,0,0,.9)",
        }}
      />

      {/* center */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 6,
          height: 6,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "#e53935",
          boxShadow: "0 0 4px rgba(0,0,0,.9)",
        }}
      />

    </div>
  );
}


// ---------------------------------------------------------
// LIVE PREVIEW LINE
// ---------------------------------------------------------

function LivePreviewLine({
  points,
  center,
}) {

  if (!points.length || !center) {
    return null;
  }

  const lastPoint =
    points[points.length - 1];

  return (
    <Polyline
      positions={[
        lastPoint,
        center,
      ]}
      pathOptions={{
        color: "#00ff66",
        weight: 4,
        opacity: 0.95,
        dashArray: "8 7",
      }}
      interactive={false}
    />
  );
}


// ---------------------------------------------------------
// FIXED POINTS
// ---------------------------------------------------------

function FixedPoints({
  points,
}) {

  return (
    <>
      {points.map((point, index) => (

        <CircleMarker
          key={`${index}-${point[0]}-${point[1]}`}
          center={point}
          radius={7}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: "#00b84f",
            fillOpacity: 1,
          }}
          interactive={false}
        />

      ))}
    </>
  );
}


// ---------------------------------------------------------
// MAIN GPS AREA PICKER
// ---------------------------------------------------------

export default function GPSAreaBoundaryPicker({
  initialPoints = [],
  onChange,
  onSave,
  onCancel,
}) {

  const safeInitialPoints =
    Array.isArray(initialPoints)
      ? initialPoints
          .map(normalizePoint)
          .filter(Boolean)
      : [];

  const [points, setPoints] =
    useState(safeInitialPoints);

  const [center, setCenter] =
    useState(
      safeInitialPoints.length
        ? safeInitialPoints[
            safeInitialPoints.length - 1
          ]
        : DEFAULT_POSITION
    );

  const centerRef =
    useRef(center);


  // -------------------------------------------------------
  // UPDATE PARENT
  // -------------------------------------------------------

  useEffect(() => {

    if (onChange) {
      onChange(points);
    }

  }, [points, onChange]);


  // -------------------------------------------------------
  // ADD CENTER POINT
  // -------------------------------------------------------

  const addPoint = () => {

    const current =
      normalizePoint(centerRef.current);

    if (!current) {
      return;
    }

    setPoints((previous) => {

      const next = [
        ...previous,
        current,
      ];

      return next;
    });

  };


  // -------------------------------------------------------
  // UNDO
  // -------------------------------------------------------

  const undo = () => {

    setPoints((previous) =>
      previous.slice(0, -1)
    );

  };


  // -------------------------------------------------------
  // CLEAR
  // -------------------------------------------------------

  const clear = () => {

    setPoints([]);

  };


  // -------------------------------------------------------
  // SAVE
  // -------------------------------------------------------

  const save = () => {

    if (points.length < 3) {
      alert(
        "يجب تحديد 3 نقاط على الأقل لتكوين الأرض."
      );

      return;
    }

    if (onSave) {
      onSave(points);
    }

  };


  // -------------------------------------------------------
  // LIVE AREA
  // -------------------------------------------------------

  const area =
    points.length >= 3
      ? calculatePolygonArea(points)
      : 0;


  // -------------------------------------------------------
  // LIVE PERIMETER
  // -------------------------------------------------------

  const perimeter =
    points.length >= 2
      ? calculatePolygonPerimeter(points)
      : 0;


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
      }}
    >

      {/* ================================================= */}
      {/* MAP */}
      {/* ================================================= */}

      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        zoomControl={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />


        <MapCenterTracker
          centerRef={centerRef}
          onCenterChange={setCenter}
        />


        {/* =============================================== */}
        {/* FIXED POLYGON */}
        {/* =============================================== */}

        {points.length >= 3 && (
          <Polygon
            positions={points}
            pathOptions={{
              color: "#00ff66",
              weight: 4,
              fillColor: "#00ff66",
              fillOpacity: 0.16,
            }}
            interactive={false}
          />
        )}


        {/* =============================================== */}
        {/* FIXED LINES */}
        {/* =============================================== */}

        {points.length >= 2 && (
          <Polyline
            positions={points}
            pathOptions={{
              color: "#00ff66",
              weight: 4,
            }}
            interactive={false}
          />
        )}


        {/* =============================================== */}
        {/* LIVE LINE */}
        {/* =============================================== */}

        <LivePreviewLine
          points={points}
          center={center}
        />


        {/* =============================================== */}
        {/* POINTS */}
        {/* =============================================== */}

        <FixedPoints
          points={points}
        />

      </MapContainer>


      {/* ================================================= */}
      {/* FIXED CENTER TARGET */}
      {/* ================================================= */}

      <FixedCenterTarget />


      {/* ================================================= */}
      {/* TOP BAR */}
      {/* ================================================= */}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10001,
          padding: "12px",
          pointerEvents: "none",
        }}
      >

        <div
          style={{
            background:
              "rgba(0,0,0,.70)",
            color: "#fff",
            borderRadius: 14,
            padding: "12px 15px",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          🛰️ تحديد الأرض
        </div>

      </div>


      {/* ================================================= */}
      {/* INSTRUCTION */}
      {/* ================================================= */}

      <div
        style={{
          position: "absolute",
          left: 15,
          right: 15,
          bottom: 185,
          zIndex: 10001,
          pointerEvents: "none",
          textAlign: "center",
        }}
      >

        <div
          style={{
            display: "inline-block",
            background:
              "rgba(0,0,0,.72)",
            color: "#fff",
            borderRadius: 16,
            padding: "10px 16px",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >

          حرّك الخريطة وضع زاوية الأرض
          <br />
          تحت المؤشر 🎯

        </div>

      </div>


      {/* ================================================= */}
      {/* CENTER COORDINATES */}
      {/* ================================================= */}

      <div
        style={{
          position: "absolute",
          left: 15,
          right: 15,
          bottom: 135,
          zIndex: 10001,
          pointerEvents: "none",
          textAlign: "center",
        }}
      >

        <div
          style={{
            display: "inline-block",
            background:
              "rgba(0,0,0,.65)",
            color: "#fff",
            borderRadius: 12,
            padding: "7px 12px",
            fontSize: 12,
            direction: "ltr",
          }}
        >

          {center[0].toFixed(7)}
          {" , "}
          {center[1].toFixed(7)}

        </div>

      </div>


      {/* ================================================= */}
      {/* ADD POINT */}
      {/* ================================================= */}

      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 82,
          zIndex: 10002,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "auto",
        }}
      >

        <button
          type="button"
          onClick={addPoint}
          style={{
            width: "100%",
            maxWidth: 360,
            border: "none",
            borderRadius: 18,
            padding: "15px 20px",
            background: "#0b8f3c",
            color: "#fff",
            fontSize: 18,
            fontWeight: 800,
            boxShadow:
              "0 5px 18px rgba(0,0,0,.35)",
          }}
        >
          📍 إضافة نقطة
        </button>

      </div>


      {/* ================================================= */}
      {/* INFORMATION */}
      {/* ================================================= */}

      <div
        style={{
          position: "absolute",
          top: 72,
          left: 15,
          right: 15,
          zIndex: 10001,
          pointerEvents: "none",
        }}
      >

        <div
          style={{
            background:
              "rgba(0,0,0,.68)",
            color: "#fff",
            borderRadius: 14,
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-around",
            gap: 8,
            fontSize: 13,
          }}
        >

          <span>
            النقاط: <b>{points.length}</b>
          </span>

          <span>
            المساحة:{" "}
            <b>
              {formatAreaValue(area)}
            </b>
          </span>

          <span>
            المحيط:{" "}
            <b>
              {formatDistanceValue(perimeter)}
            </b>
          </span>

        </div>

      </div>


      {/* ================================================= */}
      {/* BOTTOM CONTROLS */}
      {/* ================================================= */}

      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 10,
          zIndex: 10002,
          display: "flex",
          gap: 7,
          pointerEvents: "auto",
        }}
      >

        <button
          type="button"
          onClick={undo}
          disabled={!points.length}
          style={controlButtonStyle}
        >
          ↩️ تراجع
        </button>


        <button
          type="button"
          onClick={clear}
          disabled={!points.length}
          style={controlButtonStyle}
        >
          🗑️ مسح
        </button>


        <button
          type="button"
          onClick={save}
          disabled={points.length < 3}
          style={{
            ...controlButtonStyle,
            flex: 1.4,
            fontWeight: 800,
          }}
        >
          💾 اعتماد الحدود
        </button>

      </div>

    </div>
  );
}


// =========================================================
// BUTTON STYLE
// =========================================================

const controlButtonStyle = {
  flex: 1,
  minHeight: 45,
  border: "none",
  borderRadius: 13,
  background: "#ffffff",
  color: "#222",
  fontSize: 14,
  fontWeight: 700,
};


// =========================================================
// GEOMETRY
// =========================================================

const EARTH_RADIUS = 6378137;


// ---------------------------------------------------------
// HAVERSINE
// ---------------------------------------------------------

function distanceBetween(a, b) {

  const lat1 =
    (a[0] * Math.PI) / 180;

  const lat2 =
    (b[0] * Math.PI) / 180;

  const dLat =
    ((b[0] - a[0]) * Math.PI) / 180;

  const dLng =
    ((b[1] - a[1]) * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS *
    Math.atan2(
      Math.sqrt(h),
      Math.sqrt(1 - h)
    )
  );
}


// ---------------------------------------------------------
// PERIMETER
// ---------------------------------------------------------

function calculatePolygonPerimeter(
  points
) {

  if (points.length < 2) {
    return 0;
  }

  let total = 0;

  for (
    let i = 0;
    i < points.length;
    i++
  ) {

    const next =
      points[
        (i + 1) % points.length
      ];

    total += distanceBetween(
      points[i],
      next
    );
  }

  return total;
}


// ---------------------------------------------------------
// AREA
// ---------------------------------------------------------

function calculatePolygonArea(
  points
) {

  if (points.length < 3) {
    return 0;
  }

  const origin = points[0];

  const lat0 =
    (origin[0] * Math.PI) / 180;

  const metersPerLat =
    111320;

  const metersPerLng =
    111320 *
    Math.cos(lat0);

  const projected =
    points.map((point) => {

      return [
        (point[1] - origin[1]) *
          metersPerLng,

        (point[0] - origin[0]) *
          metersPerLat,
      ];

    });


  let area = 0;

  for (
    let i = 0;
    i < projected.length;
    i++
  ) {

    const j =
      (i + 1) %
      projected.length;

    area +=
      projected[i][0] *
        projected[j][1] -
      projected[j][0] *
        projected[i][1];

  }

  return Math.abs(area) / 2;
}


// ---------------------------------------------------------
// FORMAT AREA
// ---------------------------------------------------------

function formatAreaValue(
  area
) {

  if (!area || area <= 0) {
    return "0 م²";
  }

  if (area >= 10000) {

    return (
      (area / 10000).toFixed(2) +
      " هكتار"
    );

  }

  return (
    Math.round(area) +
    " م²"
  );
}


// ---------------------------------------------------------
// FORMAT DISTANCE
// ---------------------------------------------------------

function formatDistanceValue(
  distance
) {

  if (!distance || distance <= 0) {
    return "0 م";
  }

  if (distance >= 1000) {

    return (
      (distance / 1000).toFixed(2) +
      " كم"
    );

  }

  return (
    Math.round(distance) +
    " م"
  );
}
