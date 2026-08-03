// src/models/ExpenseModel.js


/**
 * Expense Model
 * نموذج المصروف الذكي
 *
 * مسؤول عن:
 * - إدارة مصاريف المزرعة
 * - دعم التقارير والتحليلات المالية
 */


export class ExpenseModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // ارتباط بالمزرعة

    this.farmId =
      data.farmId ||
      "";



    // معلومات المصروف

    this.type =
      data.type ||
      "";


    this.category =
      data.category ||
      "operation";


    this.amount =
      Number(data.amount) || 0;


    this.currency =
      data.currency ||
      "USD";



    // الدفع

    this.paymentMethod =
      data.paymentMethod ||
      "cash";



    // المورد والفاتورة

    this.supplier =
      data.supplier ||
      "";


    this.invoice =
      data.invoice ||
      "";



    // التاريخ

    this.date =
      data.date ||
      "";



    // الحالة

    this.status =
      data.status ||
      "paid";



    // الذكاء الاصطناعي

    this.aiAnalysis =
      data.aiAnalysis ||
      {


        costLevel:"normal",


        recommendation:"",


        savingTips:[],


        farmImpact:""


      };



    // ملاحظات

    this.notes =
      data.notes ||
      "";



    // النظام الزمني

    this.createdAt =
      data.createdAt ||
      new Date().toISOString();


    this.updatedAt =
      data.updatedAt ||
      new Date().toISOString();


  }





  update(data = {}){


    Object.keys(data)
    .forEach(key => {


      if(data[key] !== undefined){


        this[key] =
          data[key];


      }


    });



    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  getAmount(){


    return {


      value:this.amount,


      currency:this.currency


    };


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      type:this.type,


      category:this.category,


      amount:this.amount,


      currency:this.currency,


      paymentMethod:this.paymentMethod,


      supplier:this.supplier,


      invoice:this.invoice,


      date:this.date,


      status:this.status,


      aiAnalysis:this.aiAnalysis,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createExpense = (data = {}) => {


  return new ExpenseModel(data);


};





export const expenseCategories = [


  "operation",

  "planting",

  "fertilizer",

  "pesticide",

  "irrigation",

  "equipment",

  "workers",

  "transport",

  "maintenance",

  "other"

];





export const paymentMethods = [


  "cash",

  "bank_transfer",

  "card",

  "digital_wallet"

];





export const expenseStatus = [


  "paid",

  "pending",

  "scheduled"

];
