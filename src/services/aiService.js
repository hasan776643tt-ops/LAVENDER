// src/services/aiService.js


import storageService
  from "./storageService.js";



class AIService {


  constructor() {


    this.baseUrl =
      "";


    this.apiKey =
      "";


    this.model =
      "gpt-4.1";


    this.historyKey =
      "ai_history";


    this.version =
      "3.0.0";


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



    this.validatePrompt(
      prompt
    );



    const response =


      this.baseUrl

      ?

      {

        success:
          true,


        model:
          this.model,


        answer:
          "AI provider connection ready."

      }


      :

      {

        success:
          false,


        model:
          this.model,


        message:
          "AI_PROVIDER_NOT_CONFIGURED"

      };





    await this.saveHistory({


      id:
        this.generateId(),


      type:
        options.type ||
        "general",


      prompt,


      response,


      model:
        this.model,


      version:
        this.version,


      createdAt:
        new Date().toISOString()


    });




    return response;


  }





  async saveHistory(item) {



    const history =
      await this.getHistory();



    history.push(item);



    storageService.save(

      this.historyKey,

      history

    );


  }





  async getHistory() {


    return storageService.load(

      this.historyKey,

      []

    );


  }





  async clearHistory() {


    return storageService.remove(

      this.historyKey

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





  validatePrompt(prompt) {


    if (

      !prompt ||

      typeof prompt !== "string" ||

      !prompt.trim()

    ) {


      throw new Error(

        "AI_PROMPT_REQUIRED"

      );


    }


    return true;


  }





  generateId() {


    if (

      globalThis.crypto?.randomUUID

    ) {


      return globalThis.crypto.randomUUID();


    }




    return (

      Date.now().toString()

      +

      Math.random()

      .toString(36)

      .substring(2)

    );


  }




}



export default Object.freeze(

  new AIService()

);
