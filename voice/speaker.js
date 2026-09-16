class VoiceSpeaker {
  constructor() {
    this.provider = null;
  }

  setProvider(provider) {
    if (
      !provider ||
      typeof provider.speak !== 'function'
    ) {
      throw new Error(
        'Invalid voice provider.'
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
      console.log(
        `🔊 Voice Speaker: ${text}`
      );

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

  async announce(text, options = {}) {
    return this.speak(
      text,
      options
    );
  }

  isReady() {
    return Boolean(this.provider);
  }
}

export default new VoiceSpeaker();
