import { Decorator } from "./Decorator";
import { PathToPrintableAdapter } from "../path/PathToPrintableAdapter";
import { Session } from "@core/Session";
import { resolve } from "path";
import { Printable } from "@service/printer/Printer";

export class ModifiedFileDecorator extends Decorator<PathToPrintableAdapter> {
  session: Session;
  constructor(adapter: PathToPrintableAdapter, session: Session) {
    super(adapter);
    this.session = session;
  }

  getChildren(): Printable[] {
    return this.wrappedPrintable
      .getChildren()
      .map((c) => new ModifiedFileDecorator(c, this.session));
  }

  getContent(): string {
    const suffix = this.modified() ? " *" : "";
    return this.wrappedPrintable.getContent() + suffix;
  }

  getStartContent(): string {
    const suffix = this.modified() ? " *" : "";
    return this.wrappedPrintable.getStartContent() + suffix;
  }

  modified() {
    return this.session.editors.some(
      (e) =>
        resolve(this.wrappedPrintable.filepath) === resolve(e.filepath) &&
        e.isModified()
    );
  }
}
