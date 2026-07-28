// src/pages/Reports.jsx

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

  farms = [],
  fields = [],
  crops = [],

  irrigations = [],
  fertilizers = [],
  pesticides = [],
  diseases = [],

  expenses = [],

  consultations = [],

  aiQuestions = [],


} = useContext(FarmContext);





const {
  settings
} = useSettings();







// =========================
// KPI Statistics
// =========================


const kpi = useMemo(()=>{


return {


farms:
farms.length,


fields:
fields.length,


crops:
crops.length,


operations:

irrigations.length +

fertilizers.length +

pesticides.length +

diseases.length,



diseases:
diseases.length,


expenses:
expenses.length,


};


},[

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
expenses

]);









// =========================
// Financial Analysis
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





const average =

expenses.length

?

Math.round(
total / expenses.length
)

:

0;





return {

total,

average

};



},[expenses]);









// =========================
// Crop Analysis
// =========================


const cropAnalysis = useMemo(()=>{


const map = {};



crops.forEach(item=>{


const name =

item.name ||

"غير محدد";



map[name] =

(map[name] || 0)+1;


});




const sorted =

Object.entries(map)

.sort(

(a,b)=>

b[1]-a[1]

);




return {


top:

sorted[0]?.[0]

||

"لا يوجد",


count:

crops.length


};


},[crops]);









// =========================
// Smart Recommendations
// =========================


const recommendations = useMemo(()=>{


const result=[];



if(
diseases.length > 0
)

{

result.push(
"🦠 يوجد أمراض مسجلة، راقب صحة المحاصيل."
);

}





if(
fields.length > irrigations.length
)

{

result.push(
"💧 بعض الحقول تحتاج إلى تنظيم جدول ري."
);

}





if(
expenses.length > 5
)

{

result.push(
"💰 راجع المصاريف لتحسين الربحية."
);

}





if(
pesticides.length === 0
)

{

result.push(
"🧪 لم يتم تسجيل عمليات مكافحة آفات."
);

}





if(
result.length === 0
)

{

result.push(
"✅ حالة المزرعة مستقرة."
);

}




return result;



},[

diseases,
fields,
irrigations,
expenses,
pesticides

]);  return (

<div>


<h1>
📊 التقارير الذكية المتقدمة
</h1>


<p>
تحليل شامل لمنظومة LAVENDER Smart Farm
</p>





<Card title="🚀 مؤشرات الأداء الرئيسية">


<p>
🌾 عدد المزارع:

<strong>
{" "}
{kpi.farms}
</strong>

</p>



<p>
🌱 عدد الحقول:

<strong>
{" "}
{kpi.fields}
</strong>

</p>



<p>
🌿 عدد المحاصيل:

<strong>
{" "}
{kpi.crops}
</strong>

</p>



<p>
⚙️ إجمالي العمليات الزراعية:

<strong>
{" "}
{kpi.operations}
</strong>

</p>



</Card>







<Card title="💰 التحليل المالي">


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

عدد السجلات المالية:

<strong>

{" "}

{expenses.length}

</strong>

</p>



</Card>







<Card title="🌱 تحليل المحاصيل">


<p>

أكثر محصول مسجل:

<strong>

{" "}

{cropAnalysis.top}

</strong>

</p>




<p>

عدد المحاصيل:

<strong>

{" "}

{cropAnalysis.count}

</strong>

</p>



</Card>







<Card title="🦠 حالة صحة المحاصيل">


<p>

عدد حالات الأمراض:

<strong>

{" "}

{kpi.diseases}

</strong>

</p>



<p>

عمليات المكافحة:

<strong>

{" "}

{pesticides.length}

</strong>

</p>



</Card>







<Card title="🤖 التوصيات الذكية">


{

recommendations.map(

(item,index)=>(


<p key={index}>

{item}

</p>


)

)

}


</Card>







<Card title="👨‍🌾 النشاط والاستشارات">


<p>

📨 الاستشارات:

<strong>

{" "}

{consultations.length}

</strong>

</p>




<p>

🤖 أسئلة الذكاء الاصطناعي:

<strong>

{" "}

{aiQuestions.length}

</strong>

</p>


</Card>







<Card title="☁️ جاهزية التطوير">


<p>
📄 تصدير التقارير PDF
</p>


<p>
📊 رسوم بيانية وتحليلات متقدمة
</p>


<p>
🧠 دمج الذكاء الاصطناعي الزراعي
</p>


<p>
☁️ ربط قاعدة بيانات سحابية
</p>


</Card>






<Button>

إنشاء تقرير PDF

</Button>





</div>

);


}
