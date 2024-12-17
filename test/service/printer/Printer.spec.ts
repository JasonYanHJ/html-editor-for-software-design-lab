import {
  IndentPrintable,
  Printer,
  TreePrintable,
} from "@service/printer/Printer";
import assert from "assert";

describe("Printer", () => {
  let service: Printer;
  beforeEach(() => {
    service = new Printer();
  });

  it("asTree", async () => {
    const printable: TreePrintable = {
      getContent: () => "root",
      getChildren: () => [
        {
          getContent: () => "dir 1",
          getChildren: () => [
            {
              getContent: () => "file 11",
              getChildren: () => [],
            },
            {
              getContent: () => "sub dir 12",
              getChildren: () => [
                {
                  getContent: () => "file 121",
                  getChildren: () => [],
                },
                {
                  getContent: () => "file 122",
                  getChildren: () => [],
                },
              ],
            },
            {
              getContent: () => "sub dir 13",
              getChildren: () => [],
            },
          ],
        },
        {
          getContent: () => "dir 2",
          getChildren: () => [
            {
              getContent: () => "file 21",
              getChildren: () => [],
            },
            {
              getContent: () => "sub dir 22",
              getChildren: () => [
                {
                  getContent: () => "file 221",
                  getChildren: () => [],
                },
                {
                  getContent: () => "file 222",
                  getChildren: () => [],
                },
              ],
            },
          ],
        },
      ],
    };
    const result = await service.asTree(printable);
    assert.deepStrictEqual(result, [
      "└── root",
      "    ├── dir 1",
      "    │   ├── file 11",
      "    │   ├── sub dir 12",
      "    │   │   ├── file 121",
      "    │   │   └── file 122",
      "    │   └── sub dir 13",
      "    └── dir 2",
      "        ├── file 21",
      "        └── sub dir 22",
      "            ├── file 221",
      "            └── file 222",
    ]);
  });

  it("asIndent", async () => {
    const printable: IndentPrintable = {
      getStartContent: () => "export class TextNode implements Node {",
      getChildren: () => [
        {
          getStartContent: () => "content: string;",
          getChildren: () => [],
          getEndContent: () => null,
        },
        {
          getStartContent: () => "constructor(content: string) {",
          getChildren: () => [
            {
              getStartContent: () => "this.content = content;",
              getChildren: () => [],
              getEndContent: () => null,
            },
          ],
          getEndContent: () => "}",
        },
        {
          getStartContent: () => "accept<T>(visitor: Visitor<T>): T {",
          getChildren: () => [
            {
              getStartContent: () => "return visitor.visitTextNode(this);",
              getChildren: () => [],
              getEndContent: () => null,
            },
          ],
          getEndContent: () => "}",
        },
      ],
      getEndContent: () => "}",
    };
    const result = await service.asIndent(printable, 2);
    assert.deepStrictEqual(result, [
      "export class TextNode implements Node {",
      "  content: string;",
      "  constructor(content: string) {",
      "    this.content = content;",
      "  }",
      "  accept<T>(visitor: Visitor<T>): T {",
      "    return visitor.visitTextNode(this);",
      "  }",
      "}",
    ]);
  });
});
