export type EventCallback = (...args: any[]) => Promise<void> | void;

export interface Publisher {
  subscribe(event: string, callback: EventCallback): void;
  unsubscribe(event: string, callback: EventCallback): void;
  notify(event: string, ...args: any[]): void;
}
