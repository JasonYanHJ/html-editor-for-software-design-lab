import { UserCommandInputParser } from "@control/UserCommandInputParser";
import mock from "mock-fs";
import { factory, input, output, session } from "./setup";
import assert from "assert";
import { readFileSync } from "fs";
import { SESSION_CONFIG_FILENAME } from "@control/concrete-command/session/ExitCommand";

const fs = {
  "test1.html": `<html>
  <head>
    <title>
      test1
    </title>
  </head>
  <body>
    <div id="hello">
      hello Worlld!
    </div>
  </body>
</html>`,
  empty_dir: {},
  dir: {
    "test2.html": `<html>
  <head>
    <title>
      test2
    </title>
  </head>
  <body>
    <p id="world">
      hello
    </p>
  </body>
</html>`,
  },
};

describe("commands", () => {
  let parser: UserCommandInputParser;
  let _exit: () => never;
  beforeEach(() => {
    parser = new UserCommandInputParser(factory);
    // 拦截process.exit，避免测试程序退出
    _exit = process.exit;
    process.exit = () => null as never;
  });
  afterEach(() => {
    // 恢复process.exit
    process.exit = _exit;
  });

  async function execUserInput(input: string) {
    await parser.parse(input).execute();
  }
  function expectOutput(expectOutput: string[]) {
    assert.deepStrictEqual(output, expectOutput);
    output.length = 0; //清空输出数组
  }

  describe("without config", () => {
    beforeEach(() => {
      mock(fs);
    });
    afterEach(() => {
      mock.restore();
    });

    it("init-session", async () => {
      // 没有配置文件时，不执行操作，也不应报错
      await factory.create("init-session").execute();
    });

    it("editor-list load edit close", async () => {
      // editor-list初始为空
      await execUserInput("editor-list");
      expectOutput(["editors:"]);
      // 加载test2
      await execUserInput("load dir/test2.html");
      await execUserInput("editor-list");
      expectOutput(["editors:", "> dir/test2.html"]);
      // 打印test2的内容检查是否正确加载
      await execUserInput("print-indent");
      expectOutput([
        "<html>",
        "  <head>",
        "    <title>",
        "      test2",
        "    </title>",
        "  </head>",
        "  <body>",
        '    <p id="world">',
        "      hello",
        "    </p>",
        "  </body>",
        "</html>",
      ]);
      // 加载test1, active标识应切换到test1
      await execUserInput("load test1.html");
      await execUserInput("editor-list");
      expectOutput(["editors:", "  dir/test2.html", "> test1.html"]);
      // 切换test2, active标识应切换到test2
      await execUserInput("edit dir/test2.html");
      await execUserInput("editor-list");
      expectOutput(["editors:", "> dir/test2.html", "  test1.html"]);
      // 关闭test2, active标识应切换到test1
      await execUserInput("close");
      await execUserInput("editor-list");
      expectOutput(["editors:", "> test1.html"]);
      // 关闭test1
      await execUserInput("close");
      await execUserInput("editor-list");
      expectOutput(["editors:"]);
    });

    it("exit save close", async () => {
      await execUserInput("load dir/test2.html");
      await execUserInput("append div div2 body");
      await execUserInput("load test1.html");
      await execUserInput("append div div2 body");
      await execUserInput("showid false");
      // exit询问是否保存时，保存test1，不保存test2
      input.push("y", "n");
      // exit后预期：打印询问、保存test1、写入config
      await execUserInput("exit");
      expectOutput([
        "Save changes of file test1.html ? [y/n]",
        "Save changes of file dir/test2.html ? [y/n]",
        "Goodbye!",
      ]);
      assert.strictEqual(
        readFileSync("test1.html", { encoding: "utf8" }),
        `<html>
  <head>
    <title>
      test1
    </title>
  </head>
  <body>
    <div id="hello">
      hello Worlld!
    </div>
    <div id="div2">
    </div>
  </body>
</html>`
      );
      assert.strictEqual(
        readFileSync("dir/test2.html", { encoding: "utf8" }),
        `<html>
  <head>
    <title>
      test2
    </title>
  </head>
  <body>
    <p id="world">
      hello
    </p>
  </body>
</html>`
      );
      assert.strictEqual(
        readFileSync(SESSION_CONFIG_FILENAME, { encoding: "utf8" }),
        `{"active":"test1.html","editors":[{"filepath":"dir/test2.html","showId":true},{"filepath":"test1.html","showId":false}]}`
      );
    });

    it("spell-check", async () => {
      await execUserInput("load test1.html");
      await execUserInput("spell-check");
      expectOutput([
        "#hello: MESSAGE: This sentence does not start with an uppercase letter. SUGGESTIONS: [Hello].",
        "#hello: MESSAGE: Possible spelling mistake found. SUGGESTIONS: [World].",
      ]);
    });

    it("print-tree", async () => {
      await execUserInput("load test1.html");
      await execUserInput("print-tree");
      expectOutput([
        "└── html",
        "    ├── head",
        "    │   └── title",
        "    │       └── test1",
        "    └── body",
        "        └── div#hello",
        "            └── hello Worlld! [X]",
      ]);
    });

    describe("editor operations", () => {
      beforeEach(async () => {
        await execUserInput("load test1.html");
        await execUserInput("append div div2 body");
        await execUserInput("insert div div1 div2");
        await execUserInput("append div div3 body");
        await execUserInput("append span span div3");
        await execUserInput("insert p p div2");
        await execUserInput("edit-id hello hello-div");
        await execUserInput("edit-text hello-div newText");
        await execUserInput("delete div3");
      });

      it("append insert edit-id edit-text delete", async () => {
        await execUserInput("print-indent");
        expectOutput([
          "<html>",
          "  <head>",
          "    <title>",
          "      test1",
          "    </title>",
          "  </head>",
          "  <body>",
          '    <div id="hello-div">',
          "      newText",
          "    </div>",
          '    <div id="div1">',
          "    </div>",
          '    <p id="p">',
          "    </p>",
          '    <div id="div2">',
          "    </div>",
          "  </body>",
          "</html>",
        ]);
      });

      it("undo redo", async () => {
        // undo三次
        await execUserInput("undo");
        await execUserInput("undo");
        await execUserInput("undo");
        await execUserInput("print-indent");
        expectOutput([
          "<html>",
          "  <head>",
          "    <title>",
          "      test1",
          "    </title>",
          "  </head>",
          "  <body>",
          '    <div id="hello">',
          "      hello Worlld!",
          "    </div>",
          '    <div id="div1">',
          "    </div>",
          '    <p id="p">',
          "    </p>",
          '    <div id="div2">',
          "    </div>",
          '    <div id="div3">',
          '      <span id="span">',
          "      </span>",
          "    </div>",
          "  </body>",
          "</html>",
        ]);
        // redo两次
        await execUserInput("redo");
        await execUserInput("redo");
        await execUserInput("print-indent");
        expectOutput([
          "<html>",
          "  <head>",
          "    <title>",
          "      test1",
          "    </title>",
          "  </head>",
          "  <body>",
          '    <div id="hello-div">',
          "      newText",
          "    </div>",
          '    <div id="div1">',
          "    </div>",
          '    <p id="p">',
          "    </p>",
          '    <div id="div2">',
          "    </div>",
          '    <div id="div3">',
          '      <span id="span">',
          "      </span>",
          "    </div>",
          "  </body>",
          "</html>",
        ]);
        // 还剩一次命令可以redo，当执行新命令后，redo被清空
        await execUserInput("edit-id span hello_span");
        await assert.rejects(() => execUserInput("redo"), {
          message: "No edit operation to redo.",
        });
      });

      it("showid print-indent", async () => {
        await execUserInput("showid false");
        await execUserInput("print-indent");
        expectOutput([
          "<html>",
          "  <head>",
          "    <title>",
          "      test1",
          "    </title>",
          "  </head>",
          "  <body>",
          "    <div>",
          "      newText",
          "    </div>",
          "    <div>",
          "    </div>",
          "    <p>",
          "    </p>",
          "    <div>",
          "    </div>",
          "  </body>",
          "</html>",
        ]);
        await execUserInput("showid true");
        await execUserInput("print-indent 4");
        expectOutput([
          "<html>",
          "    <head>",
          "        <title>",
          "            test1",
          "        </title>",
          "    </head>",
          "    <body>",
          '        <div id="hello-div">',
          "            newText",
          "        </div>",
          '        <div id="div1">',
          "        </div>",
          '        <p id="p">',
          "        </p>",
          '        <div id="div2">',
          "        </div>",
          "    </body>",
          "</html>",
        ]);
      });
    });
  });

  describe("with config", () => {
    beforeEach(() => {
      mock({
        ...fs,
        [SESSION_CONFIG_FILENAME]: `{"active":"test1.html","editors":[{"filepath":"dir/test2.html","showId":true},{"filepath":"test1.html","showId":false}]}`,
      });
    });
    afterEach(() => {
      mock.restore();
    });

    it("init-session", async () => {
      await factory.create("init-session").execute();
      await execUserInput("editor-list");
      expectOutput(["editors:", "  dir/test2.html", "> test1.html"]);
      assert.deepStrictEqual(
        session.editors.map((e) => e.showId),
        [true, false]
      );
    });

    it("dir-tree", async () => {
      await execUserInput("dir-tree");
      expectOutput([
        "└── html-edtior",
        "    ├── .my_html_session_config",
        "    ├── dir",
        "    │   └── test2.html",
        "    ├── empty_dir",
        "    └── test1.html",
      ]);
      // 打开test1.html和test2.html，修改test2.html，预期test2.html后加“*”号
      await execUserInput("load dir/test2.html");
      await execUserInput("append span span body modified");
      await execUserInput("load test1.html");
      await execUserInput("dir-tree");
      expectOutput([
        "└── html-edtior",
        "    ├── .my_html_session_config",
        "    ├── dir",
        "    │   └── test2.html *",
        "    ├── empty_dir",
        "    └── test1.html",
      ]);
    });
  });
});
