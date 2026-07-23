import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Users() {

  const {
    users,
    setUsers,
  } = useContext(FarmContext);


  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [role, setRole] = useState("مزارع");



  const addUser = () => {

    if (!name || !email) return;


    const newUser = {

      id: Date.now(),

      name: name,

      email: email,

      role: role,

    };


    setUsers([
      ...users,
      newUser,
    ]);


    setName("");

    setEmail("");

    setRole("مزارع");

  };



  const deleteUser = (id) => {

    setUsers(
      users.filter(
        (user) => user.id !== id
      )
    );

  };



  return (

    <div>

      <h1>
        👤 إدارة المستخدمين
      </h1>


      <h2>
        إضافة مستخدم جديد
      </h2>



      <input
        type="text"
        placeholder="اسم المستخدم"
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
          مشرف
        </option>

        <option>
          مدير النظام
        </option>


      </select>


      <br /><br />



      <button onClick={addUser}>
        إضافة مستخدم
      </button>


      <hr />


      <h2>
        قائمة المستخدمين
      </h2>



      <ul>

        {users.map((user) => (

          <li key={user.id}>

            👤 {user.name}

            <br />

            📧 {user.email}

            <br />

            🔑 الصلاحية: {user.role}


            <br />


            <button
              onClick={() =>
                deleteUser(user.id)
              }
            >
              حذف
            </button>


          </li>

        ))}

      </ul>


    </div>

  );

}
