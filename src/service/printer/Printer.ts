// 接口的方法实现可以是同步的或者异步的
export type SyncOrAsync<T> = T | Promise<T>;

export interface IndentPrintable {
  getStartContent(): SyncOrAsync<string>;
  getChildren(): SyncOrAsync<IndentPrintable[]>;
  getEndContent(): SyncOrAsync<string | null>;
}

export interface TreePrintable {
  getContent(): SyncOrAsync<string>;
  getChildren(): SyncOrAsync<TreePrintable[]>;
}

export interface Printable extends IndentPrintable, TreePrintable {
  getChildren(): SyncOrAsync<Printable[]>;
}

export class Printer {
  async asIndent(
    node: IndentPrintable,
    indent: number,
    level: number = 0
  ): Promise<string[]> {
    const [start, end, children] = await Promise.all([
      node.getStartContent(),
      node.getEndContent(),
      Promise.all(
        (
          await node.getChildren()
        ).map((c) => this.asIndent(c, indent, level + 1))
      ),
    ]);

    const prefix = " ".repeat(indent * level);
    return [prefix + start, children, end ? [prefix + end] : []].flat(2);
  }

  async asTree(
    node: TreePrintable,
    isLast: boolean = true,
    prefix = ""
  ): Promise<string[]> {
    const [content, children] = await Promise.all([
      node.getContent(),
      Promise.all(
        (
          await node.getChildren()
        ).map((child, index, arr) =>
          this.asTree(
            child,
            index === arr.length - 1,
            prefix + (isLast ? "    " : "│   ")
          )
        )
      ),
    ]);

    return [prefix + (isLast ? "└── " : "├── ") + content, children].flat(2);
  }
}
