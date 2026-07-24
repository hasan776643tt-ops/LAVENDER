class AIService {
  constructor() {
    this.baseUrl = "";
    this.apiKey = "";
    this.model = "gpt-4.1";
  }

  configure({ baseUrl, apiKey, model }) {
    if (baseUrl) this.baseUrl = baseUrl;
    if (apiKey) this.apiKey = apiKey;
    if (model) this.model = model;
  }

  async ask(prompt, options = {}) {
    throw new Error(
      "AI provider is not configured yet."
    );
  }

  async analyzeCrop(data) {
    return this.ask(
      `حلل بيانات المحصول التالية:\n${JSON.stringify(data)}`
    );
  }

  async detectDisease(data) {
    return this.ask(
      `حلل المرض الزراعي التالي:\n${JSON.stringify(data)}`
    );
  }

  async irrigationAdvice(data) {
    return this.ask(
      `اعطني توصية ري بناءً على:\n${JSON.stringify(data)}`
    );
  }

  async fertilizerAdvice(data) {
    return this.ask(
      `اعطني توصية تسميد بناءً على:\n${JSON.stringify(data)}`
    );
  }

  async generalAdvice(question) {
    return this.ask(question);
  }
}

export const aiService = new AIService();
