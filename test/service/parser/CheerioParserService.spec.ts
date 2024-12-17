import { CheerioParserService } from "@service/parser/CheerioParserService";
import assert from "assert";

const htmlString = `<html>
  <head>
    <title>
    </title>
  </head>
  <body>
    <div id="hello">
      world
    </div>
  </body>
</html>`;

describe("CheerioParserService", () => {
  let service: CheerioParserService;
  beforeEach(() => {
    service = new CheerioParserService();
  });

  it("parse", () => {
    const doc = service.parse(htmlString);
    assert.strictEqual(doc.root.tag, "html");
    assert.strictEqual(doc.root.text, undefined);
    assert.strictEqual(doc.findById("head")!.tag, "head");
    assert.strictEqual(doc.findById("head")!.text, undefined);
    assert.strictEqual(doc.findById("title")!.tag, "title");
    assert.strictEqual(doc.findById("title")!.text, undefined);
    assert.strictEqual(doc.findById("hello")!.tag, "div");
    assert.strictEqual(doc.findById("hello")!.text, "world");
  });
});
