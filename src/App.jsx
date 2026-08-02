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



// صفحة تحميل مؤقتة

function Loading() {

  return (

    <div
      style={{
        padding: "2rem",
        textAlign: "center"
      }}
    >

      جاري التحميل...

    </div>

  );

}



// صفحة غير موجودة

function NotFound() {

  return (

    <div
      style={{
        padding: "2rem",
        textAlign: "center"
      }}
    >

      <h1>
        404
      </h1>

      <p>
        الصفحة غير موجودة
      </p>

    </div>

  );

}




export default function App() {


  return (

    <MainLayout>

      <Suspense
        fallback={<Loading />}
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
