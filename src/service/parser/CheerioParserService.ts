import { ParserService } from "./ParserService";
import * as cheerio from "cheerio";
import { Element } from "domhandler";
import { Document } from "@core/Document";
import { TagNode } from "@core/html/TagNode";

export class CheerioParserService implements ParserService {
  parse(htmlString: string): Document {
    const $ = cheerio.load(htmlString);
    const rootDom = $("html")[0];
    const root = new TagNode("html", $(rootDom).attr("id") || "html");
    const document = new Document(root);
    this.buildDocument(document, root, rootDom, $);
    return document;
  }

  buildDocument(
    doc: Document,
    node: TagNode,
    dom: Element,
    $: cheerio.CheerioAPI
  ) {
    $(dom)
      .contents()
      .each((_, child) => {
        if (child.type === "text") node.setText(child.data.trim());
        else if (child.type === "tag") {
          const newNode = new TagNode(child.tagName, $(child).attr("id"));
          doc.insert(node.id, newNode);
          this.buildDocument(doc, newNode, child, $);
        }
      });
  }
}
