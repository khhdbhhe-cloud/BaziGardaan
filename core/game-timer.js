class GameTimer {
  constructor() {
    this.timers = new Map();
    this.nextId = 1;

    console.log(
      '⏳ BaziGardaan Game Timer initialized'
    );
  }

  create(
    chatId,
    duration,
    callback,
    metadata = {}
  ) {
    if (!chatId) {
      throw new Error(
        'Chat ID is required.'
      );
    }

    if (typeof callback !== 'function') {
      throw new Error(
        'Timer callback must be a function.'
      );
    }

    const time = Number(duration);

    if (
      !Number.isFinite(time) ||
      time <= 0
    ) {
      throw new Error(
        'Timer duration must be greater than zero.'
      );
    }

    const id = this.nextId++;

    const timer = setTimeout(
      async () => {
        this.timers.delete(id);

        try {
          await callback();
        } catch (error) {
          console.error(
            `❌ Game timer error (${id}):`,
            error
          );
        }
      },
      time
    );

    this.timers.set(id, {
      id,
      chatId: String(chatId),
      timer,
      duration: time,
      metadata: {
        ...metadata
      },
      createdAt: Date.now(),
      expiresAt:
        Date.now() + time
    });

    return id;
  }

  get(id) {
    return (
      this.timers.get(
        Number(id)
      ) || null
    );
  }

  has(id) {
    return this.timers.has(
      Number(id)
    );
  }

  cancel(id) {
    const timer =
      this.get(id);

    if (!timer) {
      return false;
    }

    clearTimeout(
      timer.timer
    );

    this.timers.delete(
      Number(id)
    );

    return true;
  }

  cancelByChat(chatId) {
    const id = String(chatId);

    let cancelled = 0;

    for (
      const timer of this.timers.values()
    ) {
      if (timer.chatId !== id) {
        continue;
      }

      clearTimeout(
        timer.timer
      );

      this.timers.delete(
        timer.id
      );

      cancelled += 1;
    }

    return cancelled;
  }

  getByChat(chatId) {
    const id = String(chatId);

    return Array.from(
      this.timers.values()
    ).filter(
      (timer) =>
        timer.chatId === id
    );
  }

  getRemaining(id) {
    const timer =
      this.get(id);

    if (!timer) {
      return 0;
    }

    return Math.max(
      0,
      timer.expiresAt -
        Date.now()
    );
  }

  isExpired(id) {
    return (
      this.getRemaining(id) <= 0
    );
  }

  count() {
    return this.timers.size;
  }

  list() {
    return Array.from(
      this.timers.values()
    ).map((timer) => ({
      id: timer.id,
      chatId: timer.chatId,
      duration: timer.duration,
      remaining:
        this.getRemaining(
          timer.id
        ),
      metadata: {
        ...timer.metadata
      },
      createdAt: timer.createdAt,
      expiresAt: timer.expiresAt
    }));
  }

  clear() {
    for (
      const timer of this.timers.values()
    ) {
      clearTimeout(
        timer.timer
      );
    }

    this.timers.clear();
  }
}

const gameTimer =
  new GameTimer();

export default gameTimer;
