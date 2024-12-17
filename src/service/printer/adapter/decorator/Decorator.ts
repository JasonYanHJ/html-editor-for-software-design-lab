import { Printable } from "@service/printer/Printer";

export class Decorator<T extends Printable> implements Printable {
  wrappedPrintable: T;
  constructor(printable: T) {
    this.wrappedPrintable = printable;
  }

  getChildren() {
    return this.wrappedPrintable.getChildren();
  }
  getContent() {
    return this.wrappedPrintable.getContent();
  }
  getStartContent() {
    return this.wrappedPrintable.getStartContent();
  }
  getEndContent() {
    return this.wrappedPrintable.getEndContent();
  }
}
