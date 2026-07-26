import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Users() {

  const {
    users,
    setUsers,
  } = useContext(FarmContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("مزارع");
  const [status, setStatus] = useState("نشط");

  const addUser = () => {

    if (!name || !email) return;

    const newUser = {

      id: Date.now(),

      name,
      email,
      phone,
      role,
      status,

      createdAt:
        new Date().toLocaleDateString(),

    };

    setUsers([
      ...users,
      newUser,
    ]);

    setName("");
    setEmail("");
    setPhone("");
    setRole("مزارع");
    setStatus("نشط");

  };

  const deleteUser = (id) => {

    setUsers(
      users.filter(
        (user) =>
          user.id !== id
      )
    );

  };

  return (

    <div>

      <h1>
        👥 إدارة المستخدمين
      </h1>

      <Card title="إضافة مستخدم جديد">

        <input
          type="text"
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br /><br />

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br /><br />

        <input
          type="tel"
          placeholder="رقم الهاتف"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <br /><br />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >

          <option>
            مزارع
          </option>

          <option>
            مهندس زراعي
          </option>

          <option>
            مراقب
          </option>

          <option>
            مشرف
          </option>

          <option>
            مدير النظام
          </option>

        </select>

        <br /><br />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option>
            نشط
          </option>

          <option>
            موقوف
          </option>

          <option>
            بانتظار التفعيل
          </option>

        </select>

        <br /><br />

        <Button
          onClick={addUser}
        >
          إضافة مستخدم
        </Button>

      </Card>

      <h2>
        قائمة المستخدمين
      </h2>

      {users.map((user) => (

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
              deleteUser(user.id)
            }
          >
            حذف المستخدم
          </Button>

        </Card>

      ))}

    </div>

  );

}
