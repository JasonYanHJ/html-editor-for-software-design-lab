import { LanguageToolSpellCheckService } from "@service/spell-check/LanguageToolSpellCheckService";
import assert from "assert";

describe("LanguageToolSpellCheckService", () => {
  let service: LanguageToolSpellCheckService;
  beforeEach(() => {
    service = new LanguageToolSpellCheckService();
  });

  it("check", async () => {
    const result = await service.check("hello Worlld!");
    assert.deepStrictEqual(result, [
      "MESSAGE: This sentence does not start with an uppercase letter. SUGGESTIONS: [Hello].",
      "MESSAGE: Possible spelling mistake found. SUGGESTIONS: [World].",
    ]);
  });
});
