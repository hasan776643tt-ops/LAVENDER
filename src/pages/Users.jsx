
import { useState } from "react";

export default function Users() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("مزارع");
  const [users, setUsers] = useState([]);

  const addUser = () => {
    if (!name || !email) return;

    const newUser = {
      name,
      email,
      role,
    };

    setUsers([...users, newUser]);

    setName("");
    setEmail("");
    setRole("مزارع");
  };

  return (
    <div>
      <h1>👤 إدارة المستخدمين</h1>

      <input
        type="text"
        placeholder="اسم المستخدم"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option>مزارع</option>
        <option>مهندس زراعي</option>
        <option>مشرف</option>
        <option>مدير النظام</option>
      </select>

      <br />
      <br />

      <button onClick={addUser}>
        إضافة مستخدم
      </button>

      <hr />

      <h2>قائمة المستخدمين</h2>

      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
