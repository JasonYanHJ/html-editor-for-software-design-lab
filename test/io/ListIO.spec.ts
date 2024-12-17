import { ListIO } from "@io/ListIO";
import assert from "assert";

describe("ListIO", () => {
  let io: ListIO;
  let output: string[];
  beforeEach(() => {
    output = [];
  });

  it("printLine", () => {
    io = new ListIO([], output);
    io.printLine("Hello");
    io.printLine("world!");
    assert.deepStrictEqual(output, ["Hello", "world!"]);
  });

  it("readLine", async () => {
    const input = ["Hello"];
    io = new ListIO(input, []);
    assert(await io.readLine(), "Hello");
    input.push("world!");
    assert(await io.readLine(), "world!");
    // 模拟用户不再输入，此时再次调用readLine，应始终在pending状态不返回结果
    // 超过1s始终未获得输入，视作测试通过
    const timeoutPromise = () =>
      new Promise((_, reject) => setTimeout(reject, 1000));
    await assert.rejects(Promise.race([io.readLine(), timeoutPromise()]));
  });

  it("require", async () => {
    io = new ListIO(["k", "c", "y", "x", "n", "z"], []);
    assert.strictEqual(await io.require("[y/n]", ["y", "n"]), "y");
    assert.strictEqual(await io.require("[y/n]", ["y", "n"]), "n");
  });
});
