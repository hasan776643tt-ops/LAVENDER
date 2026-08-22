// src/pages/Users.jsx

import {
  useState,
} from "react";

import useUsers
  from "../hooks/useUsers.js";

import Card
  from "../components/Card";

import Button
  from "../components/Button";


export default function Users() {


  const {

    users = [],

    loading,

    error,

    createUser,

    deleteUser,

  } = useUsers();



  // =========================
  // Form State
  // =========================

  const initialForm = {

    name: "",

    email: "",

    phone: "",

    role: "مزارع",

    status: "نشط",

  };


  const [form, setForm] =
    useState(initialForm);



  // =========================
  // Update Form
  // =========================

  const updateForm = (
    key,
    value
  ) => {

    setForm(prev => ({

      ...prev,

      [key]: value,

    }));

  };



  // =========================
  // Create User
  // =========================

  const addUser = async () => {

    if (
      !form.name ||
      !form.email
    ) {

      return;

    }


    await createUser({

      name:
        form.name,

      email:
        form.email,

      phone:
        form.phone,

      role:
        form.role,

      status:
        form.status,

    });


    setForm({
      ...initialForm
    });

  };



  // =========================
  // Delete User
  // =========================

  const removeUser = async (
    id
  ) => {

    await deleteUser(
      id
    );

  };



  // =========================
  // UI
  // =========================

  return (

    <div>


      <h1>
        👥 إدارة المستخدمين
      </h1>



      <Card
        title="إضافة مستخدم جديد"
      >


        <input

          type="text"

          placeholder="الاسم الكامل"

          value={form.name}

          onChange={(e) =>
            updateForm(
              "name",
              e.target.value
            )
          }

        />


        <br />
        <br />


        <input

          type="email"

          placeholder="البريد الإلكتروني"

          value={form.email}

          onChange={(e) =>
            updateForm(
              "email",
              e.target.value
            )
          }

        />


        <br />
        <br />


        <input

          type="tel"

          placeholder="رقم الهاتف"

          value={form.phone}

          onChange={(e) =>
            updateForm(
              "phone",
              e.target.value
            )
          }

        />


        <br />
        <br />


        <select

          value={form.role}

          onChange={(e) =>
            updateForm(
              "role",
              e.target.value
            )
          }

        >

          <option value="مزارع">
            مزارع
          </option>

          <option value="مهندس زراعي">
            مهندس زراعي
          </option>

          <option value="مراقب">
            مراقب
          </option>

          <option value="مشرف">
            مشرف
          </option>

          <option value="مدير النظام">
            مدير النظام
          </option>

        </select>


        <br />
        <br />


        <select

          value={form.status}

          onChange={(e) =>
            updateForm(
              "status",
              e.target.value
            )
          }

        >

          <option value="نشط">
            نشط
          </option>

          <option value="موقوف">
            موقوف
          </option>

          <option value="بانتظار التفعيل">
            بانتظار التفعيل
          </option>

        </select>


        <br />
        <br />


        <Button
          onClick={addUser}
          disabled={loading}
        >

          {loading
            ? "جاري الحفظ..."
            : "إضافة مستخدم"
          }

        </Button>


      </Card>



      {
        error && (

          <Card
            title="⚠️ خطأ"
          >

            <p>
              {error.message ||
                "حدث خطأ أثناء معالجة المستخدم."}
            </p>

          </Card>

        )
      }



      <h2>
        قائمة المستخدمين
      </h2>



      {
        loading && users.length === 0 ? (

          <p>
            جاري تحميل المستخدمين...
          </p>

        ) : (

          users.map(
            user => (

              <Card

                key={user.id}

                title={user.name}

              >

                <p>

                  📧 البريد:
                  {" "}
                  {user.email}

                </p>


                <p>

                  📱 الهاتف:
                  {" "}
                  {user.phone}

                </p>


                <p>

                  🔑 الصلاحية:
                  {" "}
                  {user.role}

                </p>


                <p>

                  🟢 الحالة:
                  {" "}
                  {user.status}

                </p>


                <p>

                  📅 تاريخ الإنشاء:
                  {" "}
                  {user.createdAt}

                </p>


                <Button

                  onClick={() =>
                    removeUser(
                      user.id
                    )
                  }

                  disabled={loading}

                >

                  حذف المستخدم

                </Button>


              </Card>

            )
          )

        )
      }


    </div>

  );

}
