import { Session } from "@core/Session";
import { Command } from "./Command";
import { AppendCommand } from "./concrete-command/document/AppendCommad";
import { DeleteCommand } from "./concrete-command/document/DeleteCommad";
import { EditIdCommand } from "./concrete-command/document/EditIdCommad";
import { EditTextCommand } from "./concrete-command/document/EditTextCommad";
import { InsertCommand } from "./concrete-command/document/InsertCommad";
import { RedoCommand } from "./concrete-command/editor/RedoCommand";
import { SaveCommand } from "./concrete-command/editor/SaveCommand";
import { ShowIdCommand } from "./concrete-command/editor/ShowIdCommand";
import { UndoCommand } from "./concrete-command/editor/UndoCommand";
import { CloseCommand } from "./concrete-command/session/CloseCommand";
import { EditorListCommand } from "./concrete-command/session/EditorListCommand";
import { ExitCommand } from "./concrete-command/session/ExitCommand";
import { InitSessionCommand } from "./concrete-command/session/InitSessionCommand";
import { LoadCommand } from "./concrete-command/session/LoadCommand";
import { SwitchEditorCommand } from "./concrete-command/session/SwitchEditorCommand";
import { DirIndentCommand } from "./concrete-command/show/DirIndentCommand";
import { DirTreeCommand } from "./concrete-command/show/DirTreeCommand";
import { PrintIndentCommand } from "./concrete-command/show/PrintIndentCommand";
import { PrintTreeCommand } from "./concrete-command/show/PrintTreeCommand";
import { SpellCheckCommand } from "./concrete-command/show/SpellCheckCommand";
import { IO } from "@io/IO";
import { SpellCheckService } from "@service/spell-check/SpellCheckService";
import { Printer } from "@service/printer/Printer";
import { ParserService } from "@service/parser/ParserService";
import { CanUndoDecorator } from "./decorator/CanUndoDecorator";

export type UserCommandName =
  | "insert"
  | "append"
  | "edit-id"
  | "edit-text"
  | "delete"
  | "save"
  | "undo"
  | "redo"
  | "showid"
  | "editor-list"
  | "edit"
  | "load"
  | "close"
  | "exit"
  | "print-tree"
  | "print-indent"
  | "dir-tree"
  | "dir-indent"
  | "spell-check";

export type SystemCommandName = "init-session";
export type CommandName = UserCommandName | SystemCommandName;

export class CommandFactory {
  session: Session;
  io: IO;
  checker: SpellCheckService;
  printer: Printer;
  parser: ParserService;
  constructor(
    session: Session,
    io: IO,
    checker: SpellCheckService,
    printer: Printer,
    parser: ParserService
  ) {
    this.session = session;
    this.io = io;
    this.checker = checker;
    this.printer = printer;
    this.parser = parser;
  }

  getEditor() {
    if (!this.session.activeEditor) throw Error("No active editor.");
    return this.session.activeEditor;
  }

  canUndo(command: Command): Command {
    return new CanUndoDecorator(command, this.getEditor());
  }

  create(name: CommandName, ...args: any[]): Command {
    switch (name) {
      case "insert":
        return this.canUndo(
          new InsertCommand(
            this.getEditor().document,
            args[0],
            args[1],
            args[2],
            args[3]
          )
        );
      case "append":
        return this.canUndo(
          new AppendCommand(
            this.getEditor().document,
            args[0],
            args[1],
            args[2],
            args[3]
          )
        );
      case "edit-id":
        return this.canUndo(
          new EditIdCommand(this.getEditor().document, args[0], args[1])
        );
      case "edit-text":
        return this.canUndo(
          new EditTextCommand(this.getEditor().document, args[0], args[1])
        );
      case "delete":
        return this.canUndo(
          new DeleteCommand(this.getEditor().document, args[0])
        );
      case "save":
        return new SaveCommand(this.getEditor());
      case "undo":
        return new UndoCommand(this.getEditor());
      case "redo":
        return new RedoCommand(this.getEditor());
      case "showid":
        return new ShowIdCommand(this.getEditor(), args[0]);
      case "editor-list":
        return new EditorListCommand(this.session, this.io);
      case "edit":
        return new SwitchEditorCommand(this.session, args[0]);
      case "load":
        return new LoadCommand(this.session, this.parser, args[0]);
      case "close":
        return new CloseCommand(this.session, this.io);
      case "exit":
        return new ExitCommand(this.session, this.io);
      case "print-tree":
        return new PrintTreeCommand(
          this.getEditor(),
          this.printer,
          this.io,
          this.checker
        );
      case "print-indent":
        return new PrintIndentCommand(
          this.getEditor(),
          this.printer,
          this.io,
          args[0]
        );
      case "dir-tree":
        return new DirTreeCommand(this.session, this.printer, this.io);
      case "dir-indent":
        return new DirIndentCommand(
          this.session,
          this.printer,
          this.io,
          args[0]
        );
      case "spell-check":
        return new SpellCheckCommand(this.getEditor(), this.io, this.checker);
      case "init-session":
        return new InitSessionCommand(this.session, this);
    }
  }
}
