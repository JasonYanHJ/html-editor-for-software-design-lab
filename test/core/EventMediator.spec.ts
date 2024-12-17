import { EventMediator } from "@core/event-mediator/EventMediator";
import assert from "assert";

describe("EventMediator", () => {
  it("singleton", () => {
    const instance1 = EventMediator.getInstance();
    const instance2 = EventMediator.getInstance();
    assert.strictEqual(instance1, instance2);
  });

  describe("event", () => {
    let output: string[] = [];
    const onEventA1 = () => {
      output.push("1 react to event a");
    };
    const onEventA2 = () => {
      output.push("2 react to event a");
    };
    beforeEach(() => {
      output.length = 0;
    });

    it("no subscribers", () => {
      EventMediator.getInstance().notify("a");
      assert.deepStrictEqual(output, []);
    });

    it("subscribe", () => {
      EventMediator.getInstance().subscribe("a", onEventA1);
      EventMediator.getInstance().subscribe("a", onEventA2);
      // 重复添加应被忽略
      EventMediator.getInstance().subscribe("a", onEventA2);

      EventMediator.getInstance().notify("a");
      assert.strictEqual(output.length, 2);
      assert(output.includes("1 react to event a"));
      assert(output.includes("2 react to event a"));
    });

    it("unsubscribe", () => {
      EventMediator.getInstance().subscribe("a", onEventA1);
      EventMediator.getInstance().subscribe("a", onEventA2);
      EventMediator.getInstance().unsubscribe("a", onEventA2);
      // 应被删除应被忽略
      EventMediator.getInstance().unsubscribe("a", onEventA2);

      EventMediator.getInstance().notify("a");
      assert.deepStrictEqual(output, ["1 react to event a"]);
    });
  });
});
