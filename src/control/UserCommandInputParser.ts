import { Command } from "./Command";
import { CommandFactory, UserCommandName } from "./CommandFactory";

export class UserCommandInputParser {
  commands: {
    [key in UserCommandName]: {
      regex: RegExp;
      args: (m: RegExpMatchArray) => any[];
    };
  } = {
    insert: {
      regex: /^insert (\S+) (\S+) (\S+)( (.+))?$/,
      args: (m) => [m[1], m[2], m[3], m[5]],
    },
    append: {
      regex: /^append (\S+) (\S+) (\S+)( (.+))?$/,
      args: (m) => [m[1], m[2], m[3], m[5]],
    },
    "edit-id": {
      regex: /^edit-id (\S+) (\S+)$/,
      args: (m) => [m[1], m[2]],
    },
    "edit-text": {
      regex: /^edit-text (\S+)( (.+))?$/,
      args: (m) => [m[1], m[3]],
    },
    delete: {
      regex: /^delete (\S+)$/,
      args: (m) => [m[1]],
    },
    save: {
      regex: /^save$/,
      args: () => [],
    },
    undo: {
      regex: /^undo$/,
      args: () => [],
    },
    redo: {
      regex: /^redo$/,
      args: () => [],
    },
    showid: {
      regex: /^showid (true|false)$/,
      args: (m) => [this.parseBool(m[1])],
    },
    "editor-list": {
      regex: /^editor-list$/,
      args: () => [],
    },
    edit: {
      regex: /^edit (\S+)$/,
      args: (m) => [m[1]],
    },
    load: {
      regex: /^load (\S+)$/,
      args: (m) => [m[1]],
    },
    close: {
      regex: /^close$/,
      args: () => [],
    },
    exit: {
      regex: /^exit$/,
      args: () => [],
    },
    "print-tree": {
      regex: /^print-tree$/,
      args: () => [],
    },
    "print-indent": {
      regex: /^print-indent( (\d+))?$/,
      args: (m) => [m[2] ? parseInt(m[2]) : 2],
    },
    "dir-tree": {
      regex: /^dir-tree$/,
      args: () => [],
    },
    "dir-indent": {
      regex: /^dir-indent( (\d+))?$/,
      args: (m) => [m[2] ? parseInt(m[2]) : 2],
    },
    "spell-check": {
      regex: /^spell-check$/,
      args: () => [],
    },
  };
  factory: CommandFactory;
  constructor(factory: CommandFactory) {
    this.factory = factory;
  }

  parse(input: string): Command {
    for (const name of Object.keys(this.commands) as UserCommandName[]) {
      const { regex, args } = this.commands[name];
      const match = regex.exec(input);
      if (match) return this.factory.create(name, ...args(match));
    }
    throw Error("Invalid command.");
  }

  parseBool(s: string) {
    return s === "true";
  }
}
