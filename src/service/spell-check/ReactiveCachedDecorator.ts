import { EventMediator } from "@core/event-mediator/EventMediator";
import { SpellCheckService } from "./SpellCheckService";

export class ReactiveCachedDecorator implements SpellCheckService {
  static cache = new Map<string, string[]>();
  wrapped: SpellCheckService;
  constructor(checker: SpellCheckService) {
    this.wrapped = checker;
    // 监听text-change事件，提前检查文本拼写，并且缓存结果
    EventMediator.getInstance().subscribe(
      "text-change",
      this.onTextChange.bind(this)
    );
  }
  get cache() {
    return ReactiveCachedDecorator.cache;
  }

  async check(text: string): Promise<string[]> {
    const cachedResult = this.cache.get(text);
    if (cachedResult) return cachedResult;

    const result = await this.wrapped.check(text);
    this.cache.set(text, result);

    return result;
  }

  async onTextChange(data: {
    oldText: string | undefined;
    newText: string | undefined;
  }) {
    const { oldText, newText } = data;
    if (oldText) this.cache.delete(oldText);
    if (newText && !this.cache.has(newText)) {
      // 提前执行的文本拼写检查不抛出任何异常
      try {
        const result = await this.wrapped.check(newText);
        this.cache.set(newText, result);
      } catch (e) {}
    }
  }
}
