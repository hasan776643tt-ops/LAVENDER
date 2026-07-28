// src/components/Sidebar.jsx


import {
  NavLink
} from "react-router-dom";



export default function Sidebar(){



const menuItems = [


{
title:"الرئيسية",
path:"/",
icon:"🏠"
},


{
title:"لوحة التحكم",
path:"/dashboard",
icon:"📊"
},


{
title:"المزارع",
path:"/farms",
icon:"🌾"
},


{
title:"الحقول",
path:"/fields",
icon:"📍"
},


{
title:"المحاصيل",
path:"/crops",
icon:"🌱"
},


{
title:"الري",
path:"/irrigation",
icon:"💧"
},


{
title:"الأسمدة",
path:"/fertilizers",
icon:"🧪"
},


{
title:"المبيدات",
path:"/pesticides",
icon:"🛡️"
},


{
title:"الأمراض",
path:"/diseases",
icon:"🦠"
},


{
title:"الطقس",
path:"/weather",
icon:"☀️"
},


{
title:"الخريطة",
path:"/map",
icon:"🗺️"
},


{
title:"المصاريف",
path:"/expenses",
icon:"💰"
},


{
title:"الحصاد",
path:"/harvest",
icon:"🚜"
},


{
title:"المخزون",
path:"/inventory",
icon:"📦"
},


{
title:"التقارير",
path:"/reports",
icon:"📈"
},


{
title:"الذكاء الاصطناعي",
path:"/ai",
icon:"🤖"
},


{
title:"المهندس الزراعي",
path:"/engineer",
icon:"👨‍🌾"
},


{
title:"المستخدمون",
path:"/users",
icon:"👥"
},


{
title:"الإعدادات",
path:"/settings",
icon:"⚙️"
}


];





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

menuItems.map((item)=>(


<li

key={item.path}

>


<NavLink

to={item.path}

className={

({isActive}) =>

isActive

?

"sidebar-link active"

:

"sidebar-link"

}

>


<span className="sidebar-icon">

{item.icon}

</span>


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
