import { Document } from "@core/Document";
import { Editor } from "@core/Editor";
import { Session } from "@core/Session";
import assert from "assert";

describe("Session", () => {
  let session: Session;
  let editors: Editor[];
  beforeEach(() => {
    session = new Session();
    editors = ["0", "1", "2", "3"].map((id) => new Editor(new Document(), id));
    editors.forEach((e) => session.loadEditor(e));
  });

  it("init", () => {
    session = new Session();
    assert.strictEqual(session.activeEditor, undefined);
    assert.deepStrictEqual(session.editors, []);
  });

  it("loadEditor", () => {
    assert.deepStrictEqual(session.editors, editors);
    assert.strictEqual(session.activeEditor, editors[3]);
  });

  it("switchEditor", () => {
    session.switchEditor("0");
    session.switchEditor("1");
    assert.deepStrictEqual(session.editors, editors);
    assert.strictEqual(session.activeEditor, editors[1]);
    // editor不存在
    assert.throws(() => session.switchEditor("xxx"), {
      message: "Editor with filepath xxx not found.",
    });
  });

  it("closeActiveEditor", () => {
    session.closeActiveEditor(); // close 3, active 3->0
    session.closeActiveEditor(); // close 0, active 0->1
    assert.strictEqual(session.activeEditor, editors[1]);
    assert.deepStrictEqual(session.editors, [editors[1], editors[2]]);
    // 全部关闭后再尝试关闭
    session.closeActiveEditor();
    session.closeActiveEditor();
    assert.throws(() => session.closeActiveEditor(), {
      message: "No active editor to close.",
    });
  });
});
