import { Document } from "@core/Document";

export interface ParserService {
  parse(htmlString: string): Document;
}
