class TextToSpeech {
  constructor() {
    this.provider = null;
  }

  setProvider(provider) {
    if (
      !provider ||
      typeof provider.speak !== 'function'
    ) {
      throw new Error(
        'Invalid TTS provider.'
      );
    }

    this.provider = provider;

    return true;
  }

  async speak(text, options = {}) {
    if (!text) {
      return null;
    }

    if (!this.provider) {
      return {
        text,
        audio: null
      };
    }

    return this.provider.speak(
      text,
      options
    );
  }

  async generate(text, options = {}) {
    return this.speak(
      text,
      options
    );
  }

  isReady() {
    return Boolean(this.provider);
  }

  getProvider() {
    return this.provider;
  }

  clearProvider() {
    this.provider = null;
  }
}

export default new TextToSpeech();
