// src/services/aiService.js


import storageService
  from "./storageService.js";



class AIService {


  constructor() {

    this.baseUrl = "";

    this.apiKey = "";

    this.model =
      "gpt-4.1";


    this.historyKey =
      "ai_history";

  }




  configure({
    baseUrl,
    apiKey,
    model
  } = {}) {


    if (baseUrl) {

      this.baseUrl =
        baseUrl;

    }


    if (apiKey) {

      this.apiKey =
        apiKey;

    }


    if (model) {

      this.model =
        model;

    }


  }




  async ask(
    prompt,
    options = {}
  ) {

    try {


      if (!prompt?.trim()) {

        throw new Error(
          "AI prompt is required"
        );

      }



      if (!this.baseUrl) {

        return {

          success: false,

          message:
            "AI provider is not configured yet.",

          prompt

        };

      }



      const response = {

        success: true,

        model:
          this.model,

        answer:
          "AI response will be connected here."

      };



      this.saveHistory({

        type:
          options.type || "general",

        prompt,

        response,

        date:
          new Date().toISOString()

      });



      return response;



    } catch (error) {

      throw new Error(
        `AIService ask failed: ${error.message}`
      );

    }

  }




  saveHistory(item) {


    const history =
      storageService.load(
        this.historyKey,
        []
      );


    history.push(
      item
    );


    storageService.save(
      this.historyKey,
      history
    );


  }




  async analyzeCrop(data) {


    return this.ask(

      `حلل بيانات المحصول:
${JSON.stringify(data)}`,

      {
        type:
          "crop-analysis"
      }

    );

  }




  async detectDisease(data) {


    return this.ask(

      `حلل المرض الزراعي:
${JSON.stringify(data)}`,

      {
        type:
          "disease-detection"
      }

    );

  }




  async irrigationAdvice(data) {


    return this.ask(

      `اعطني توصية ري:
${JSON.stringify(data)}`,

      {
        type:
          "irrigation"
      }

    );

  }




  async fertilizerAdvice(data) {


    return this.ask(

      `اعطني توصية تسميد:
${JSON.stringify(data)}`,

      {
        type:
          "fertilizer"
      }

    );

  }




  async generalAdvice(question) {


    return this.ask(

      question,

      {
        type:
          "general"
      }

    );

  }


}



export default Object.freeze(
  new AIService()
);
