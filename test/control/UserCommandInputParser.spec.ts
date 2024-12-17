import { UserCommandInputParser } from "@control/UserCommandInputParser";
import assert from "assert";
import { factory } from "./setup";
import { UserCommandName } from "@control/CommandFactory";

describe("UserCommandInputParser", () => {
  let parser: UserCommandInputParser;
  beforeEach(() => {
    parser = new UserCommandInputParser(factory);
  });

  function testRegex(
    name: UserCommandName,
    input: string,
    expectArgs: any[] | null
  ) {
    const { regex, args } = parser.commands[name];
    const m = regex.exec(input);
    if (m) assert.deepStrictEqual(args(m), expectArgs);
    else assert.strictEqual(expectArgs, null);
  }

  it("parse", () => {
    // insert
    testRegex("insert", "insert xxx", null);
    testRegex("insert", "insert div div body", [
      "div",
      "div",
      "body",
      undefined,
    ]);
    testRegex("insert", "insert div div body text", [
      "div",
      "div",
      "body",
      "text",
    ]);
    testRegex("insert", "insert div div body hello world!", [
      "div",
      "div",
      "body",
      "hello world!",
    ]);
    // append
    testRegex("append", "append xxx", null);
    testRegex("append", "append div div body", [
      "div",
      "div",
      "body",
      undefined,
    ]);
    testRegex("append", "append div div body text", [
      "div",
      "div",
      "body",
      "text",
    ]);
    testRegex("append", "append div div body hello world!", [
      "div",
      "div",
      "body",
      "hello world!",
    ]);
    // edit-id
    testRegex("edit-id", "edit-id xxx", null);
    testRegex("edit-id", "edit-id old new", ["old", "new"]);
    // edit-text
    testRegex("edit-text", "edit-text", null);
    testRegex("edit-text", "edit-text body", ["body", undefined]);
    testRegex("edit-text", "edit-text body hello", ["body", "hello"]);
    testRegex("edit-text", "edit-text body hello world!", [
      "body",
      "hello world!",
    ]);
    // delete
    testRegex("delete", "delete", null);
    testRegex("delete", "delete body", ["body"]);
    // save
    testRegex("save", "save xxx", null);
    testRegex("save", "save", []);
    // undo
    testRegex("undo", "undo xxx", null);
    testRegex("undo", "undo", []);
    // redo
    testRegex("redo", "redo xxx", null);
    testRegex("redo", "redo", []);
    // showid
    testRegex("showid", "showid", null);
    testRegex("showid", "showid xxx", null);
    testRegex("showid", "showid true", [true]);
    testRegex("showid", "showid false", [false]);
    // editor-list
    testRegex("editor-list", "editor-list xxx", null);
    testRegex("editor-list", "editor-list", []);
    // edit
    testRegex("edit", "edit", null);
    testRegex("edit", "edit dir/test.html", ["dir/test.html"]);
    // load
    testRegex("load", "load", null);
    testRegex("load", "load dir/test.html", ["dir/test.html"]);
    // close
    testRegex("close", "close xxx", null);
    testRegex("close", "close", []);
    // exit
    testRegex("exit", "exit xxx", null);
    testRegex("exit", "exit", []);
    // print-tree
    testRegex("print-tree", "print-tree xxx", null);
    testRegex("print-tree", "print-tree", []);
    // print-indent
    testRegex("print-indent", "print-indent", [2]);
    testRegex("print-indent", "print-indent x", null);
    testRegex("print-indent", "print-indent 4", [4]);
    // dir-tree
    testRegex("dir-tree", "dir-tree xxx", null);
    testRegex("dir-tree", "dir-tree", []);
    // dir-indent
    testRegex("dir-indent", "dir-indent", [2]);
    testRegex("dir-indent", "dir-indent x", null);
    testRegex("dir-indent", "dir-indent 4", [4]);
    // spell-check
    testRegex("spell-check", "spell-check xxx", null);
    testRegex("spell-check", "spell-check", []);
  });
});
