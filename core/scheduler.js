class Scheduler {
  constructor() {
    this.tasks = new Map();
    this.nextId = 1;

    console.log('⏰ BaziGardaan Scheduler initialized');
  }

  create(callback, delay, options = {}) {
    if (typeof callback !== 'function') {
      throw new Error('Scheduler callback must be a function.');
    }

    const duration = Number(delay);

    if (!Number.isFinite(duration) || duration < 0) {
      throw new Error('Invalid scheduler delay.');
    }

    const id = this.nextId++;

    const task = {
      id,
      callback,
      delay: duration,
      name: options.name || `task_${id}`,
      repeat: Boolean(options.repeat),
      createdAt: Date.now(),
      timer: null
    };

    const execute = async () => {
      try {
        await callback();
      } catch (error) {
        console.error(
          `❌ Scheduler task error "${task.name}":`,
          error
        );
      }

      if (task.repeat && this.tasks.has(id)) {
        task.timer = setTimeout(execute, task.delay);
      } else {
        this.tasks.delete(id);
      }
    };

    task.timer = setTimeout(execute, duration);

    this.tasks.set(id, task);

    return id;
  }

  once(callback, delay, options = {}) {
    return this.create(callback, delay, {
      ...options,
      repeat: false
    });
  }

  every(callback, interval, options = {}) {
    return this.create(callback, interval, {
      ...options,
      repeat: true
    });
  }

  get(id) {
    return this.tasks.get(Number(id)) || null;
  }

  has(id) {
    return this.tasks.has(Number(id));
  }

  cancel(id) {
    const task = this.get(id);

    if (!task) {
      return false;
    }

    if (task.timer) {
      clearTimeout(task.timer);
    }

    this.tasks.delete(task.id);

    return true;
  }

  cancelAll() {
    for (const task of this.tasks.values()) {
      if (task.timer) {
        clearTimeout(task.timer);
      }
    }

    const count = this.tasks.size;

    this.tasks.clear();

    return count;
  }

  count() {
    return this.tasks.size;
  }

  list() {
    return Array.from(this.tasks.values()).map((task) => ({
      id: task.id,
      name: task.name,
      delay: task.delay,
      repeat: task.repeat,
      createdAt: task.createdAt
    }));
  }

  clear() {
    return this.cancelAll();
  }
}

const scheduler = new Scheduler();

export default scheduler;
