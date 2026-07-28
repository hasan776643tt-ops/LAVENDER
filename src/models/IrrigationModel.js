// src/models/IrrigationModel.js


export const createIrrigationModel = (data = {}) => {


  return {


    // المعرف

    id:
      data.id ||
      crypto.randomUUID(),



    // العلاقات الزراعية

    farmId:
      data.farmId || "",


    fieldId:
      data.fieldId || "",


    cropId:
      data.cropId || "",




    // معلومات الري

    method:
      data.method ||
      "تنقيط",


    waterAmount:
      Number(
        data.waterAmount || 0
      ),


    waterUnit:
      data.waterUnit ||
      "liter",



    duration:
      Number(
        data.duration || 0
      ),



    // الجدولة

    date:
      data.date || "",


    status:
      data.status ||
      "scheduled",




    // مستوى الأهمية

    priority:
      data.priority ||
      "medium",




    // بيانات ذكية

    weatherImpact:
      data.weatherImpact ||
      "",


    soilMoisture:
      Number(
        data.soilMoisture || 0
      ),


    efficiency:
      Number(
        data.efficiency || 0
      ),




    // الملاحظات

    notes:
      data.notes || "",




    // بيانات النظام

    createdAt:
      data.createdAt ||
      new Date().toISOString(),



    updatedAt:
      new Date().toISOString()


  };

};
