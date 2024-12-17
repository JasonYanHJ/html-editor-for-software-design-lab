import { TagNode } from "@core/html/TagNode";
import assert from "assert";

describe("TagNode", () => {
  let body: TagNode, div1: TagNode, p1: TagNode, p2: TagNode;
  beforeEach(() => {
    body = new TagNode("body");
    div1 = new TagNode("div", "div1");
    p1 = new TagNode("p", "p1");
    p2 = new TagNode("p", "p2");
  });

  it("init", () => {
    assert.strictEqual(body.id, "body");
    assert.strictEqual(body.tag, "body");
    assert.strictEqual(body.parent, undefined);
    assert.deepStrictEqual(body.children, []);
    // 除了[html/head/title/body]，初始化必须指定id
    assert.throws(() => new TagNode("xxx"), {
      message: "Tag node except [html/head/title/body] must have an id.",
    });
  });

  it("setText", () => {
    assert.strictEqual(p1.text, undefined);
    p1.setText("hello");
    assert.strictEqual(p1.text, "hello");
    p1.setText("world");
    assert.strictEqual(p1.text, "world");
    p1.setText(undefined);
    assert.strictEqual(p1.text, undefined);
  });

  describe("operations", () => {
    beforeEach(() => {
      div1.insert(p2);
      div1.insert(p1, 0);
      body.insert(div1);
    });

    it("insert", () => {
      // 插入顺序正确
      assert.deepStrictEqual(div1.children, [p1, p2]);
      // parent设置正确
      assert.strictEqual(div1.parent, body);
    });

    it("indexOf", () => {
      assert.strictEqual(div1.indexOf("p1"), 0);
      assert.strictEqual(div1.indexOf("p2"), 1);
      assert.strictEqual(div1.indexOf("xxx"), undefined);
    });

    it("delete", () => {
      body.delete("div1");
      assert.deepStrictEqual(body.children, []);
      assert.strictEqual(div1.parent, undefined);
      // 重复删除
      assert.throws(() => body.delete("div1"), {
        message: "Node with childId div1 not found.",
      });
    });
  });
});
