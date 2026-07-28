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
// KPI Statistics
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
info:"الحقول المسجلة"
},


{
title:"🌿 المحاصيل",
value:crops.length,
info:"المحاصيل الحالية"
},


{
title:"💧 الري",
value:irrigations.length,
info:"عمليات الري"
},


{
title:"🌾 التسميد",
value:fertilizers.length,
info:"عمليات التسميد"
},


{
title:"🧪 المبيدات",
value:pesticides.length,
info:"عمليات المكافحة"
},


{
title:"🦠 الأمراض",
value:diseases.length,
info:"الحالات المرضية"
},


{
title:"🚜 الحصاد",
value:harvests.length,
info:"عمليات الحصاد"
},


{
title:"📦 المخزون",
value:inventory.length,
info:"مواد المخزون"
},


],[
farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
harvests,
inventory
]);






// =========================
// Financial
// =========================


const financial = useMemo(()=>{


const total = expenses.reduce(

(sum,item)=>

sum + Number(item.amount || 0),

0

);



return {

total,

records:
expenses.length

};


},[expenses]);






// =========================
// Smart Health
// =========================


const farmHealth = useMemo(()=>{


let score = 100;



if(diseases.length)

score -= 20;



if(irrigations.length < fields.length)

score -= 15;



if(fertilizers.length === 0)

score -= 10;



if(score < 0)

score = 0;



return score;


},[

diseases,

irrigations,

fields,

fertilizers

]);








// =========================
// Smart Alerts
// =========================


const alerts = useMemo(()=>{


const result=[];



if(diseases.length > 0)

result.push(
"🦠 توجد أمراض تحتاج متابعة."
);



if(inventory.length === 0)

result.push(
"📦 المخزون فارغ، أضف المواد الزراعية."
);



if(fields.length > irrigations.length)

result.push(
"💧 بعض الحقول تحتاج خطة ري."
);



if(result.length===0)

result.push(
"✅ جميع الأنظمة تعمل بشكل جيد."
);



return result;


},[

diseases,

inventory,

fields,

irrigations

]);






return (

<div>



<h1>
📊 لوحة التحكم الذكية
</h1>


<p>
🌱 LAVENDER Smart Farm
<br/>
نظام إدارة ومراقبة المزرعة
</p>






<Card title="🚀 صحة المزرعة">


<h2>
{farmHealth}%
</h2>


<p>
مؤشر الحالة الزراعية
</p>


</Card>







<Card title="💰 التحليل المالي">


<p>
إجمالي المصاريف:
</p>


<h2>
{financial.total}
</h2>


<p>
عدد السجلات:
{" "}
{financial.records}
</p>


</Card>







<Card title="🤖 التنبيهات الذكية">


{

alerts.map(

(alert,index)=>(

<p key={index}>
{alert}
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
✅ نظام CRUD الزراعي فعال
</p>


<p>
✅ البيانات محفوظة محلياً
</p>


<p>
✅ Harvest جاهز
</p>


<p>
✅ Inventory جاهز
</p>


<p>
✅ جاهز للمرحلة السحابية
</p>


</Card>





</div>

);


}
