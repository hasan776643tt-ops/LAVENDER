// src/components/Sidebar.jsx

import {
  NavLink
} from "react-router-dom";

import menuConfig from "../config/menuConfig.js";


export default function Sidebar() {


  return (

    <aside

      className="sidebar"

      aria-label="القائمة الرئيسية"

    >


      <div className="sidebar-brand">


        <h2>
          🌱 LAVENDER
        </h2>


        <p>
          Smart Farm
        </p>


      </div>



      <nav>


        <ul>


          {
            menuConfig.map((item)=>(

              <li

                key={item.id}

              >


                <NavLink

                  to={item.path}

                  className={({isActive}) =>

                    isActive

                    ?

                    "sidebar-link active"

                    :

                    "sidebar-link"

                  }

                >


                  {
                    item.icon && (

                      <span className="sidebar-icon">

                        {item.icon}

                      </span>

                    )
                  }



                  <span>

                    {item.title}

                  </span>



                </NavLink>


              </li>

            ))
          }


        </ul>


      </nav>


    </aside>

  );

}
