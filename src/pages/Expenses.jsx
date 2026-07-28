import {
  useContext,
  useMemo,
  useState
} from "react";


import {
  FarmContext
} from "../context/FarmContext";


import Card from "../components/Card";
import Button from "../components/Button";



export default function Expenses(){


const {


farms = [],

expenses = [],

addExpense,

updateExpense,

deleteExpense


}=useContext(FarmContext);




// =====================
// Form Model
// =====================


const emptyForm = {


farmId:"",

type:"",

amount:"",

currency:"ل.س",

paymentMethod:"نقدي",

supplier:"",

invoice:"",

date:"",

category:"",

status:"paid",

notes:""


};





const [form,setForm]=

useState(emptyForm);



const [editId,setEditId]=

useState(null);



const [search,setSearch]=

useState("");





// =====================
// Update Form
// =====================


const updateForm=(key,value)=>{


setForm(prev=>({

...prev,

[key]:value

}));

};





// =====================
// Clear
// =====================


const clearForm=()=>{


setForm(emptyForm);

setEditId(null);


};





// =====================
// Save
// =====================


const saveExpense=()=>{


if(

!form.type ||

!form.amount

)

return;



if(editId){


updateExpense(

editId,

form

);


}

else{


addExpense({

...form,

amount:Number(form.amount),

createdAt:
new Date()
.toISOString()

});


}



clearForm();


};





// =====================
// Edit
// =====================


const editExpense=(item)=>{


setForm({

farmId:item.farmId || "",

type:item.type || "",

amount:item.amount || "",

currency:item.currency || "ل.س",

paymentMethod:item.paymentMethod || "نقدي",

supplier:item.supplier || "",

invoice:item.invoice || "",

date:item.date || "",

category:item.category || "",

status:item.status || "paid",

notes:item.notes || ""


});


setEditId(item.id);


};



//   // =====================
// Smart Statistics
// =====================


const totalExpenses = useMemo(()=>{


return expenses.reduce(

(sum,item)=>

sum +

Number(item.amount || 0),

0

);


},[
expenses
]);





const expenseCount = useMemo(()=>{


return expenses.length;


},[
expenses
]);






// =====================
// Search
// =====================


const filteredExpenses = useMemo(()=>{


return expenses.filter(item=>{


return (

item.type

?.toLowerCase()

.includes(

search.toLowerCase()

)

);


});


},[

expenses,

search

]);







// =====================
// Smart Analysis
// =====================


const smartAdvice = useMemo(()=>{


if(
totalExpenses > 1000000
)

return "⚠️ المصاريف مرتفعة، راجع إدارة التكاليف.";



if(
expenseCount > 20
)

return "📊 يوجد نشاط مالي كبير، يفضل إنشاء تقرير مالي.";



return "✅ الوضع المالي يحتاج متابعة دورية.";



},[

totalExpenses,

expenseCount

]);






// =====================
// UI
// =====================


return (

<div>


<h1>
💰 الإدارة المالية الذكية
</h1>




<Card

title={
editId
?
"✏️ تعديل مصروف"
:
"➕ إضافة مصروف جديد"
}

>




<select

value={form.farmId}

onChange={(e)=>

updateForm(
"farmId",
e.target.value
)

}

>

<option value="">
اختر المزرعة
</option>


{

farms.map(farm=>(

<option

key={farm.id}

value={farm.id}

>

{farm.name}

</option>

))

}


</select>





<input

placeholder="نوع المصروف"

value={form.type}

onChange={(e)=>

updateForm(
"type",
e.target.value
)

}

/>





<input

type="number"

placeholder="قيمة المصروف"

value={form.amount}

onChange={(e)=>

updateForm(
"amount",
e.target.value
)

}

/>





<select

value={form.currency}

onChange={(e)=>

updateForm(
"currency",
e.target.value
)

}

>


<option>
ل.س
</option>


<option>
$
</option>


<option>
€
</option>


<option>
₺
</option>


</select>





<select

value={form.paymentMethod}

onChange={(e)=>

updateForm(
"paymentMethod",
e.target.value
)

}

>


<option>
نقدي
</option>


<option>
تحويل بنكي
</option>


<option>
بطاقة
</option>


<option>
محفظة إلكترونية
</option>


</select>





<input

placeholder="المورد"

value={form.supplier}

onChange={(e)=>

updateForm(
"supplier",
e.target.value
)

}

/>





<input

placeholder="رقم الفاتورة"

value={form.invoice}

onChange={(e)=>

updateForm(
"invoice",
e.target.value
)

}

/>




  // =====================
// Continue UI
// =====================


<input

type="date"

value={form.date}

onChange={(e)=>

updateForm(
"date",
e.target.value
)

}

/>





<select

value={form.category}

onChange={(e)=>

updateForm(
"category",
e.target.value
)

}

>

<option value="">
تصنيف المصروف
</option>


<option>
تشغيل
</option>


<option>
زراعة
</option>


<option>
معدات
</option>


<option>
عمال
</option>


<option>
نقل
</option>


<option>
صيانة
</option>


</select>





<select

value={form.status}

onChange={(e)=>

updateForm(
"status",
e.target.value
)

}

>


<option value="paid">
مدفوع
</option>


<option value="pending">
معلق
</option>


<option value="scheduled">
مجدول
</option>


</select>





<textarea

placeholder="ملاحظات"

value={form.notes}

onChange={(e)=>

updateForm(
"notes",
e.target.value
)

}

/>





<Button

onClick={saveExpense}

>

{

editId

?

"حفظ التعديل"

:

"إضافة المصروف"

}

</Button>




</Card>









<Card title="🤖 التحليل المالي الذكي">


<p>
{smartAdvice}
</p>


</Card>









<Card title="🔎 البحث">


<input

placeholder="ابحث عن مصروف"

value={search}

onChange={(e)=>

setSearch(
e.target.value
)

}

/>


</Card>









<Card title="📊 الملخص المالي">


<h2>
{totalExpenses}
</h2>


<p>
إجمالي المصاريف
</p>


<p>
عدد العمليات:
{" "}
{expenseCount}
</p>


</Card>









<h2>
📑 سجل المصاريف
</h2>





{

filteredExpenses.map(item=>(


<Card

key={item.id}

title={
item.type
}

>


<p>
💵 القيمة:
{" "}
{item.amount}
{" "}
{item.currency}
</p>



<p>
🏦 الدفع:
{" "}
{item.paymentMethod}
</p>



<p>
🏢 المورد:
{" "}
{item.supplier}
</p>



<p>
🧾 الفاتورة:
{" "}
{item.invoice}
</p>



<p>
📂 التصنيف:
{" "}
{item.category}
</p>



<p>
📅 التاريخ:
{" "}
{item.date}
</p>



<p>
🚦 الحالة:
{" "}
{item.status}
</p>



<p>
📝 الملاحظات:
{" "}
{item.notes}
</p>





<Button

onClick={()=>editExpense(item)}

>

تعديل

</Button>





<Button

onClick={()=>deleteExpense(item.id)}

>

حذف

</Button>



</Card>


))


}



</div>

);


}
