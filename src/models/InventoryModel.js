// src/models/InventoryModel.js


/**
 * Inventory Model
 * نموذج المخزون الذكي
 *
 * مسؤول عن:
 * - إدارة مخزون المزرعة
 * - متابعة المواد الزراعية
 * - دعم التحليلات والتقارير
 */


export class InventoryModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // العلاقات

    this.farmId =
      data.farmId ||
      "";



    // بيانات العنصر

    this.name =
      data.name ||
      "";


    this.category =
      data.category ||
      "";



    this.type =
      data.type ||
      "";



    // الكمية

    this.quantity =
      Number(data.quantity) || 0;


    this.unit =
      data.unit ||
      "unit";



    this.minimumStock =
      Number(data.minimumStock) || 0;



    // المورد

    this.supplier =
      data.supplier ||
      "";


    this.cost =
      Number(data.cost) || 0;


    this.currency =
      data.currency ||
      "USD";



    // الموقع

    this.storageLocation =
      data.storageLocation ||
      "";



    // الحالة

    this.status =
      data.status ||
      "available";



    // تاريخ الانتهاء

    this.expiryDate =
      data.expiryDate ||
      "";



    // بيانات ذكية

    this.aiAnalysis =
      data.aiAnalysis ||
      {


        stockLevel:"normal",


        recommendation:""


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





  isLowStock(){


    return (

      this.quantity <=

      this.minimumStock

    );


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      name:this.name,


      category:this.category,


      type:this.type,


      quantity:this.quantity,


      unit:this.unit,


      minimumStock:this.minimumStock,


      supplier:this.supplier,


      cost:this.cost,


      currency:this.currency,


      storageLocation:this.storageLocation,


      status:this.status,


      expiryDate:this.expiryDate,


      aiAnalysis:this.aiAnalysis,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createInventory = (data = {}) => {


  return new InventoryModel(data);


};
