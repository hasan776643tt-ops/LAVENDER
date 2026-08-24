// src/App.jsx

import {
  Routes,
  Route
} from "react-router-dom";

import {
  Suspense
} from "react";

import MainLayout from "./layouts/MainLayout";

import routes from "./routes";


// =========================================================
// Loading Screen
// =========================================================

function Loading() {

  return (

    <div
      className="app-loading"
      dir="rtl"
    >

      <div
        className="app-loading-icon"
        aria-hidden="true"
      >
        🌿
      </div>

      <h2>
        LAVENDER
      </h2>

      <p>
        جاري التحميل...
      </p>

    </div>

  );

}


// =========================================================
// 404
// =========================================================

function NotFound() {

  return (

    <div
      className="app-not-found"
      dir="rtl"
    >

      <div
        className="app-not-found-icon"
        aria-hidden="true"
      >
        🌱
      </div>

      <h1>
        404
      </h1>

      <p>
        الصفحة غير موجودة
      </p>

    </div>

  );

}


// =========================================================
// APP
// =========================================================

export default function App() {

  return (

    <MainLayout>

      <Suspense
        fallback={
          <Loading />
        }
      >

        <Routes>

          {

            routes.map(
              (route) => (

                <Route
                  key={
                    route.path
                  }

                  path={
                    route.path
                  }

                  element={
                    <route.element />
                  }

                />

              )
            )

          }


          <Route
            path="*"
            element={
              <NotFound />
            }
          />

        </Routes>

      </Suspense>

    </MainLayout>

  );

}
