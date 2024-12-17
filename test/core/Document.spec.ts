import { Document } from "@core/Document";
import { TagNode } from "@core/html/TagNode";
import assert from "assert";

describe("Document", () => {
  let document: Document;
  beforeEach(() => {
    document = new Document();
  });

  it("init", () => {
    assert.strictEqual(document.idMap.size, 4);
  });

  it("init with node", () => {
    const tagNode = new TagNode("html");
    tagNode.insert(new TagNode("head"));
    tagNode.insert(new TagNode("body"));
    document = new Document(tagNode);
    assert.strictEqual(document.idMap.size, 3);
  });

  it("findById", () => {
    // 查找节点存在
    assert.strictEqual(document.findById("html")?.id, "html");
    // 查找节点不存在
    assert.strictEqual(document.findById("xxx"), undefined);
  });

  describe("operations", () => {
    beforeEach(() => {
      // 乱序插入
      document.insert("body", new TagNode("div", "div2"));
      document.insert("body", new TagNode("div", "div4"));
      document.insert("body", new TagNode("div", "div3"), 1);
      document.insert("body", new TagNode("div", "div1"), 0);
      document.insert("div3", new TagNode("p", "p2"));
      document.insert("div3", new TagNode("p", "p1"), 0);
    });

    it("insert", () => {
      // 正确插入
      const body = document.findById("body");
      const div3 = document.findById("div3");
      assert.deepStrictEqual(
        body?.childTagNodes.map((c) => c.id),
        ["div1", "div2", "div3", "div4"]
      );
      assert.deepStrictEqual(
        div3?.childTagNodes.map((c) => c.id),
        ["p1", "p2"]
      );
      // 插入位置不存在
      assert.throws(() => document.insert("xxx", new TagNode("div", "div5")), {
        message: "Node with id xxx not found.",
      });
      // 插入重复id
      assert.throws(() => document.insert("body", new TagNode("div", "div2")), {
        message: "Dupilicate id div2 .",
      });
    });

    it("delete", () => {
      // 正确删除
      document.delete("div3");
      const body = document.findById("body");
      assert.deepStrictEqual(
        body?.childTagNodes.map((c) => c.id),
        ["div1", "div2", "div4"]
      );
      // 重复删除
      assert.throws(() => document.delete("div3"), {
        message: "Node with id div3 not found.",
      });
      // 删除已被删除节点的孩子节点
      assert.throws(() => document.delete("p2"), {
        message: "Node with id p2 not found.",
      });
      // 删除根节点
      assert.throws(() => document.delete("html"), {
        message: "Cannot delete root node.",
      });
    });

    it("editId", () => {
      // 正确更改
      document.editId("p1", "p11");
      assert.strictEqual(document.findById("p1"), undefined);
      assert.notStrictEqual(document.findById("p11"), undefined);
      // newId重复
      assert.throws(() => document.editId("p2", "p11"), {
        message: "Dupilicate id p11 .",
      });
      // oldId不存在
      assert.throws(() => document.editId("p1", "p22"), {
        message: "Node with id p1 not found.",
      });
    });
  });
});
