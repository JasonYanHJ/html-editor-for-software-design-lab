import { Document } from "@core/Document";
import { Editor } from "@core/Editor";
import { TagNode } from "@core/html/TagNode";
import assert from "assert";
import { readFileSync } from "fs";
import mock from "mock-fs";

describe("Editor", () => {
  let editor: Editor;
  beforeEach(() => {
    mock({
      "test.html": "",
    });
    editor = new Editor(new Document(), "test.html");
  });
  afterEach(() => {
    mock.restore();
  });

  it("save", async () => {
    editor.document.insert("body", new TagNode("div", "hello"));
    editor.document.findById("hello")!.setText("world");
    await editor.save();
    assert.strictEqual(
      readFileSync("test.html", { encoding: "utf8" }),
      `<html>
  <head>
    <title>
    </title>
  </head>
  <body>
    <div id="hello">
      world
    </div>
  </body>
</html>`
    );
  });
});
