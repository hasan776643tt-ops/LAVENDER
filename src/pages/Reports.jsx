import {
  useContext,
  useMemo,
} from "react";


import {
  FarmContext
} from "../context/FarmContext";


import {
  useSettings
} from "../context/SettingsContext";


import Card from "../components/Card";
import Button from "../components/Button";



export default function Reports(){


const {

 farms=[],
 fields=[],
 crops=[],

 irrigations=[],
 fertilizers=[],
 pesticides=[],

 diseases=[],

 expenses=[],

 consultations=[],
 aiQuestions=[],

 harvests=[],
 inventory=[],

} = useContext(FarmContext);




const {
 settings
} = useSettings();





// =======================
// KPI
// =======================


const kpi = useMemo(()=>({


farms: farms.length,

fields: fields.length,

crops: crops.length,

operations:

irrigations.length +
fertilizers.length +
pesticides.length +
diseases.length,


harvests:
harvests.length,


inventory:
inventory.length,


}),[

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







// =======================
// Financial Report
// =======================


const financial = useMemo(()=>{


const total = expenses.reduce(

(sum,item)=>

sum + Number(item.amount || 0),

0

);



return {

total,

count: expenses.length,

average:

expenses.length

?

Math.round(
total / expenses.length
)

:

0


};


},[expenses]);







// =======================
// Farm Health Score
// =======================


const healthScore = useMemo(()=>{


let score = 100;



if(diseases.length)

score -= 20;



if(fields.length > irrigations.length)

score -= 15;



if(fertilizers.length===0)

score -= 10;



if(score < 0)

score = 0;



return score;



},[

diseases,
fields,
irrigations,
fertilizers

]);







// =======================
// Crop Intelligence
// =======================


const cropReport = useMemo(()=>{


const counter={};



crops.forEach(crop=>{


const name =
crop.name || "غير محدد";


counter[name] =
(counter[name] || 0)+1;


});



const result =
Object.entries(counter)
.sort(
(a,b)=>b[1]-a[1]
);



return {

top:
result[0]?.[0] || "لا يوجد",

count:
crops.length

};


},[crops]);







// =======================
// Smart Advice
// =======================


const advice = useMemo(()=>{


const list=[];



if(diseases.length)

list.push(
"🦠 توجد أمراض تحتاج متابعة."
);



if(fields.length > irrigations.length)

list.push(
"💧 راجع خطة الري للحقول."
);



if(expenses.length > 10)

list.push(
"💰 المصاريف مرتفعة، راجع التكاليف."
);



if(inventory.length===0)

list.push(
"📦 أضف بيانات المخزون."
);



if(list.length===0)

list.push(
"✅ حالة المزرعة ممتازة."
);



return list;



},[

diseases,
fields,
irrigations,
expenses,
inventory

]);







return (

<div>


<h1>
📊 التقارير الذكية المتقدمة
</h1>


<p>
🌱 LAVENDER Smart Farm
<br/>
تحليل شامل لأداء المزرعة
</p>





<Card title="🚀 مؤشرات الأداء">


<h2>
{kpi.operations}
</h2>


<p>
إجمالي العمليات الزراعية
</p>


<p>
🌾 المزارع: {kpi.farms}
</p>


<p>
🌱 الحقول: {kpi.fields}
</p>


<p>
🌿 المحاصيل: {kpi.crops}
</p>


</Card>







<Card title="❤️ صحة المزرعة">


<h2>
{healthScore}%
</h2>


<p>
مؤشر الحالة الزراعية الذكية
</p>


</Card>







<Card title="💰 التقرير المالي">


<p>
إجمالي المصاريف:

<strong>

{" "}

{financial.total}

{" "}

{settings.currency}

</strong>

</p>



<p>
متوسط المصروف:

<strong>

{" "}

{financial.average}

{" "}

{settings.currency}

</strong>

</p>



<p>
عدد العمليات المالية:
{" "}
{financial.count}
</p>


</Card>







<Card title="🌿 تحليل المحاصيل">


<p>
أكثر محصول:

<strong>
{" "}
{cropReport.top}
</strong>

</p>


<p>
عدد المحاصيل:
{" "}
{cropReport.count}
</p>


</Card>







<Card title="🤖 التوصيات الذكية">


{

advice.map(

(item,index)=>(

<p key={index}>
{item}
</p>

)

)

}


</Card>







<Card title="👨‍🌾 الأنشطة المستقبلية">


<p>
📨 الاستشارات:
{" "}
{consultations.length}
</p>


<p>
🤖 أسئلة AI:
{" "}
{aiQuestions.length}
</p>


<p>
🚜 الحصاد:
{" "}
{kpi.harvests}
</p>


</Card>







<Card title="☁️ جاهزية النظام">


<p>
✅ البيانات الزراعية مترابطة
</p>


<p>
✅ جاهز للرسوم البيانية
</p>


<p>
✅ جاهز لتصدير JSON
</p>

<p>
✅ جاهز لتصدير CSV
</p>


<p>
✅ جاهز للذكاء الاصطناعي
</p>


<p>
✅ جاهز للقاعدة السحابية
</p>


</Card>












</div>

);


}
