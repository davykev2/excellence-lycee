/**
 * Serializes saves for one attempt/question while keeping unrelated questions parallel.
 * This prevents an older slow PUT from overwriting the final answer flushed at submit.
 */
export class HomeworkAnswerSaveQueue {
  private readonly chains = new Map<string, Promise<void>>();

  enqueue(key: string, task: () => Promise<void>) {
    const previous = this.chains.get(key) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(task);
    this.chains.set(key, current);
    void current.finally(() => {
      if (this.chains.get(key) === current) this.chains.delete(key);
    }).catch(() => undefined);
    return current;
  }
}
