import { TagNode } from "./html/TagNode";

export class Document {
  root!: TagNode;
  idMap: Map<string, TagNode>; // 使用Map来加速查找
  constructor(root?: TagNode) {
    this.idMap = new Map<string, TagNode>();
    if (root) {
      this.root = root;
      this.registerId(this.root);
    } else this.init();
  }

  init() {
    this.root = new TagNode("html", "html");
    this.idMap.set(this.root.id, this.root);

    this.insert("html", new TagNode("head", "head"));
    this.insert("html", new TagNode("body", "body"));
    this.insert("head", new TagNode("title", "title"));
  }

  findById(id: string) {
    return this.idMap.get(id);
  }

  registerId(tagNode: TagNode) {
    this.idMap.set(tagNode.id, tagNode);
    tagNode.childTagNodes.forEach((c) => this.registerId(c));
  }

  unregisterId(tagNode: TagNode) {
    this.idMap.delete(tagNode.id);
    tagNode.childTagNodes.forEach((c) => this.unregisterId(c));
  }

  isIdValid(newId: string) {
    return !this.idMap.has(newId);
  }

  insert(parentId: string, tagNode: TagNode, index?: number) {
    const parentNode = this.findById(parentId);
    if (!parentNode) throw Error(`Node with id ${parentId} not found.`);
    if (!this.isIdValid(tagNode.id))
      throw Error(`Dupilicate id ${tagNode.id} .`);

    parentNode.insert(tagNode, index);
    this.registerId(tagNode);
  }

  delete(id: string) {
    const tagNode = this.findById(id);
    if (!tagNode) throw Error(`Node with id ${id} not found.`);
    if (!tagNode.parent) throw Error(`Cannot delete root node.`);

    tagNode.parent.delete(id);
    this.unregisterId(tagNode);
  }

  editId(oldId: string, newId: string) {
    const tagNode = this.findById(oldId);
    if (!tagNode) throw Error(`Node with id ${oldId} not found.`);
    if (!this.isIdValid(newId)) throw Error(`Dupilicate id ${newId} .`);

    tagNode.id = newId;
    this.idMap.delete(oldId);
    this.idMap.set(newId, tagNode);
  }
}
