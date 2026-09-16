const utils = {
  isValidId(value) {
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ''
    );
  },

  normalizeText(text) {
    if (typeof text !== 'string') {
      return '';
    }

    return text
      .trim()
      .replace(/\s+/g, ' ');
  },

  normalizeCommand(text) {
    const normalized = this.normalizeText(text);

    if (!normalized) {
      return '';
    }

    return normalized
      .split(/\s+/)[0]
      .replace(/^\/+/, '')
      .replace(/@\w+$/, '')
      .toLowerCase();
  },

  getUserName(user) {
    if (!user) {
      return 'بازیکن';
    }

    if (user.first_name) {
      return user.first_name;
    }

    if (user.firstName) {
      return user.firstName;
    }

    if (user.username) {
      return `@${user.username}`;
    }

    return 'بازیکن';
  },

  getUsername(user) {
    if (!user?.username) {
      return null;
    }

    return user.username.startsWith('@')
      ? user.username
      : `@${user.username}`;
  },

  formatUser(user) {
    const username = this.getUsername(user);

    if (username) {
      return username;
    }

    return this.getUserName(user);
  },

  clamp(value, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return min;
    }

    return Math.min(
      Math.max(number, min),
      max
    );
  },

  randomInt(min, max) {
    const minimum = Math.ceil(Number(min));
    const maximum = Math.floor(Number(max));

    if (
      !Number.isFinite(minimum) ||
      !Number.isFinite(maximum) ||
      maximum < minimum
    ) {
      throw new Error(
        'Invalid random number range.'
      );
    }

    return (
      Math.floor(
        Math.random() *
          (maximum - minimum + 1)
      ) + minimum
    );
  },

  randomItem(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    return items[
      Math.floor(Math.random() * items.length)
    ];
  },

  shuffle(items = []) {
    if (!Array.isArray(items)) {
      return [];
    }

    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [result[i], result[j]] = [
        result[j],
        result[i]
      ];
    }

    return result;
  },

  sleep(ms) {
    const delay = Number(ms);

    if (!Number.isFinite(delay) || delay < 0) {
      return Promise.reject(
        new Error('Invalid sleep duration.')
      );
    }

    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  },

  formatDuration(ms) {
    const duration = Number(ms);

    if (!Number.isFinite(duration) || duration < 0) {
      return '0 ثانیه';
    }

    const totalSeconds = Math.floor(
      duration / 1000
    );

    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    const parts = [];

    if (hours > 0) {
      parts.push(`${hours} ساعت`);
    }

    if (minutes > 0) {
      parts.push(`${minutes} دقیقه`);
    }

    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} ثانیه`);
    }

    return parts.join(' و ');
  },

  now() {
    return Date.now();
  },

  createId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
};

export default utils;
