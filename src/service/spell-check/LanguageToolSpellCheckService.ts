import axios from "axios";
import { SpellCheckService } from "./SpellCheckService";

const LANGUAGE_TOOL_API = "https://api.languagetool.org/v2/check";
interface Match {
  message: string;
  replacements: { value: string }[];
}

export class LanguageToolSpellCheckService implements SpellCheckService {
  async check(text: string): Promise<string[]> {
    try {
      const response = await axios.post(LANGUAGE_TOOL_API, null, {
        params: { text, language: "en-US" },
      });
      const matches: Match[] = response.data.matches;
      return this.toResultString(matches);
    } catch (e) {
      throw Error("An error occurred in language tool api request.");
    }
  }

  toResultString(matches: Match[]) {
    return matches.map((m) => {
      const suggestions = m.replacements.map((r) => r.value).join(", ");
      return `MESSAGE: ${m.message} SUGGESTIONS: [${suggestions}].`;
    });
  }
}
