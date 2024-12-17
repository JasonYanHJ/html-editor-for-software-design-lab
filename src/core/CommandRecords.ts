import { Command } from "@control/Command";

export class CommandRecords {
  records: Command[] = [];
  editStamp: number = 0;
  savedEditStamp: number = 0;
  size: number; // 支持记录的最大命令数量

  constructor(size: number = 5) {
    this.size = size;
  }

  addRecord(cmd: Command) {
    // 添加新记录时，应清除原本可以被redo的记录
    this.records.splice(this.editStamp++, Infinity, cmd);
    // 记录数量超过上限时，丢弃最早的记录
    if (this.records.length > this.size) {
      this.records.shift();
      this.editStamp--;
      this.savedEditStamp--;
    }
  }

  save() {
    this.savedEditStamp = this.editStamp;
  }

  isModified() {
    return this.savedEditStamp !== this.editStamp;
  }

  async undo() {
    if (this.editStamp === 0) throw Error("No edit operation to undo.");

    await this.records[--this.editStamp].undo();
  }

  async redo() {
    if (this.editStamp === this.records.length)
      throw Error("No edit operation to redo.");

    await this.records[this.editStamp++].execute();
  }
}
