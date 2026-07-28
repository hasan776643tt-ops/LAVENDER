// src/pages/Dashboard.jsx

import {
  useContext,
  useMemo,
} from "react";


import {
  FarmContext
} from "../context/FarmContext";


import Card from "../components/Card";




export default function Dashboard(){



const {

  farms = [],
  fields = [],
  crops = [],

  irrigations = [],
  fertilizers = [],
  pesticides = [],

  diseases = [],

  expenses = [],

  harvests = [],

  inventory = [],


} = useContext(FarmContext);








// =========================
// Statistics
// =========================


const statistics = useMemo(()=>[



{
title:"🌾 المزارع",
value:farms.length,
info:"إجمالي المزارع"
},



{
title:"🌱 الحقول",
value:fields.length,
info:"إجمالي الحقول"
},



{
title:"🌿 المحاصيل",
value:crops.length,
info:"المحاصيل المسجلة"
},



{
title:"💧 الري",
value:irrigations.length,
info:"عمليات الري"
},



{
title:"🧪 المبيدات",
value:pesticides.length,
info:"عمليات المكافحة"
},



{
title:"🌾 الأسمدة",
value:fertilizers.length,
info:"عمليات التسميد"
},



{
title:"🦠 الأمراض",
value:diseases.length,
info:"الحالات المرضية"
},



{
title:"📦 المخزون",
value:inventory.length,
info:"مواد المخزون"
},



{
title:"🚜 الحصاد",
value:harvests.length,
info:"عمليات الحصاد"
},



],[
farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
inventory,
harvests
]);










// =========================
// Financial Summary
// =========================


const financial = useMemo(()=>{


const total =

expenses.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);



return {

total,

count:
expenses.length

};



},[expenses]);










// =========================
// Farm Activity Score
// =========================


const activityScore = useMemo(()=>{


const total =

farms.length +

fields.length +

crops.length +

irrigations.length +

fertilizers.length +

pesticides.length +

diseases.length;



return total;


},[

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases

]);










// =========================
// Smart Alerts
// =========================


const alerts = useMemo(()=>{


const list=[];



if(
diseases.length > 0
)

list.push(
"🦠 توجد حالات مرضية تحتاج متابعة."
);




if(
fields.length > irrigations.length
)

list.push(
"💧 بعض الحقول تحتاج جدولة ري."
);




if(
expenses.length > 5
)

list.push(
"💰 راجع المصاريف لتحسين الإدارة."
);




if(
list.length === 0
)

list.push(
"✅ النظام الزراعي يعمل بشكل مستقر."
);



return list;


},[

diseases,
fields,
irrigations,
expenses

]);  return (

<div>



<h1>
📊 لوحة التحكم الذكية
</h1>



<p>
🌱 LAVENDER Smart Farm
<br/>
إدارة ومراقبة الأنظمة الزراعية
</p>







<Card title="🚀 الأداء العام">



<h2>
{activityScore}
</h2>



<p>
إجمالي النشاطات الزراعية
</p>



</Card>








<Card title="💰 الملخص المالي">


<p>

إجمالي المصاريف:

<strong>

{" "}

{financial.total}

{" "}

ل.س

</strong>

</p>




<p>

عدد السجلات المالية:

<strong>

{" "}

{financial.count}

</strong>

</p>



</Card>








<Card title="🤖 التنبيهات الذكية">



{

alerts.map(

(item,index)=>(


<p key={index}>

{item}

</p>


)

)

}



</Card>








<Card title="📈 مؤشرات النظام">



{

statistics.map(item=>(


<Card

key={item.title}

title={item.title}

>


<h2>

{item.value}

</h2>


<p>

{item.info}

</p>


</Card>



))

}



</Card>








<Card title="🌱 حالة LAVENDER">


<p>
✅ نظام إدارة البيانات فعال
</p>


<p>
✅ LocalStorage يعمل
</p>


<p>
✅ CRUD الزراعي جاهز
</p>


<p>
✅ جاهز للتطوير إلى قاعدة بيانات سحابية
</p>


<p>
✅ جاهز لإضافة الذكاء الاصطناعي
</p>



</Card>






</div>

);


}
