import { EventCallback, Publisher } from "./PubSubPattern";

export class EventMediator implements Publisher {
  callbacksMap = new Map<string, EventCallback[]>();

  // 单例模式
  private static instance?: EventMediator;
  private constructor() {}
  static getInstance() {
    if (!this.instance) this.instance = new EventMediator();
    return this.instance;
  }

  subscribe(event: string, cb: EventCallback): void {
    const callbacks = this.callbacksMap.get(event);
    if (!callbacks) this.callbacksMap.set(event, [cb]);
    else if (!callbacks.includes(cb)) callbacks.push(cb);
  }

  unsubscribe(event: string, cb: EventCallback): void {
    const callbacks = this.callbacksMap.get(event);
    if (!callbacks) return;
    this.callbacksMap.set(
      event,
      callbacks.filter((c) => c !== cb)
    );
  }

  notify(event: string, ...args: any[]): void {
    const callbacks = this.callbacksMap.get(event);
    if (!callbacks) return;
    callbacks.forEach((cb) => cb(...args));
  }
}
