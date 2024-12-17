import { Command } from "@control/Command";
import { CommandRecords } from "@core/CommandRecords";
import assert from "assert";

// 一个将自己的id写入目标list中的Command，用于测试
class MockCommand extends Command {
  list: number[];
  id: number;
  constructor(list: number[], id: number) {
    super();
    this.list = list;
    this.id = id;
  }
  async execute(): Promise<void> {
    this.list.push(this.id);
  }
  async undo(): Promise<void> {
    this.list.pop();
  }
}

describe("CommandRecords", () => {
  let records: CommandRecords;
  let list: number[];
  let fakeCommands: MockCommand[];
  const exec = (c: Command) => {
    c.execute();
    records.addRecord(c);
  };
  beforeEach(() => {
    records = new CommandRecords(3);
    list = [];
    fakeCommands = [1, 2, 3, 4].map((id) => new MockCommand(list, id));
  });

  it("init", async () => {
    assert.strictEqual(records.isModified(), false);
    assert.strictEqual(records.editStamp, 0);
    assert.strictEqual(records.savedEditStamp, 0);
    await assert.rejects(() => records.undo(), {
      message: "No edit operation to undo.",
    });
    await assert.rejects(() => records.redo(), {
      message: "No edit operation to redo.",
    });
  });

  describe("operations", () => {
    beforeEach(() => {
      fakeCommands.forEach(exec);
    });

    it("addRecord", () => {
      assert.deepStrictEqual(list, [1, 2, 3, 4]);
      assert.strictEqual(records.editStamp, 3);
      assert.strictEqual(records.savedEditStamp, -1);
      // 超出数量上限，丢弃最早的一条记录
      assert.deepStrictEqual(
        records.records.map((c) => (c as MockCommand).id),
        [2, 3, 4]
      );
    });

    it("save", () => {
      records.save();
      assert.strictEqual(records.editStamp, 3);
      assert.strictEqual(records.savedEditStamp, 3);
      assert.strictEqual(records.isModified(), false);
    });

    it("undo", async () => {
      await records.undo();
      await records.undo();
      await records.undo();
      assert.deepStrictEqual(list, [1]);
      assert.strictEqual(records.editStamp, 0);
      assert.strictEqual(records.savedEditStamp, -1);
      assert.deepStrictEqual(
        records.records.map((c) => (c as MockCommand).id),
        [2, 3, 4]
      );

      await assert.rejects(() => records.undo(), {
        message: "No edit operation to undo.",
      });
    });

    it("redo", async () => {
      await records.undo();
      await records.undo();
      await records.undo();
      await records.redo();
      await records.redo();
      await records.redo();
      assert.deepStrictEqual(list, [1, 2, 3, 4]);
      assert.strictEqual(records.editStamp, 3);
      assert.strictEqual(records.savedEditStamp, -1);
      assert.deepStrictEqual(
        records.records.map((c) => (c as MockCommand).id),
        [2, 3, 4]
      );

      await assert.rejects(() => records.redo(), {
        message: "No edit operation to redo.",
      });
    });

    it("undo & addRecord", async () => {
      await records.undo();
      await records.undo();
      exec(new MockCommand(list, 5));
      assert.deepStrictEqual(list, [1, 2, 5]);
      assert.strictEqual(records.editStamp, 2);
      assert.strictEqual(records.savedEditStamp, -1);
      // 添加新记录时，应清除原本可以被redo的记录
      assert.deepStrictEqual(
        records.records.map((c) => (c as MockCommand).id),
        [2, 5]
      );
    });
  });
});
