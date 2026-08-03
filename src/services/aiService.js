// src/services/aiService.js

import storageService
  from "./storageService.js";


class AIService {


  constructor() {

    this.baseUrl = "";

    this.apiKey = "";

    this.model = "gpt-4.1";

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

    if (
      !prompt ||
      !prompt.trim()
    ) {

      throw new Error(
        "AI_PROMPT_REQUIRED"
      );

    }



    const response =
      this.baseUrl
        ? {
            success: true,
            model: this.model,
            answer:
              "AI response will be connected here."
          }
        : {
            success: false,
            model: this.model,
            message:
              "AI_PROVIDER_NOT_CONFIGURED"
          };



    this.saveHistory({

      id:
        crypto.randomUUID(),

      type:
        options.type ||
        "general",

      prompt,

      response,

      createdAt:
        new Date().toISOString()

    });



    return response;

  }



  saveHistory(item) {

    const history =
      this.getHistory();


    history.push(
      item
    );


    storageService.save(
      this.historyKey,
      history
    );

  }



  getHistory() {

    return storageService.load(
      this.historyKey,
      []
    );

  }



  clearHistory() {

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


}


export default Object.freeze(
  new AIService()
);
