import { CommandFactory } from "@control/CommandFactory";
import { UserCommandInputParser } from "@control/UserCommandInputParser";
import { Session } from "@core/Session";
import { StdIO } from "@io/StdIO";
import { CheerioParserService } from "@service/parser/CheerioParserService";
import { Printer } from "@service/printer/Printer";
import { LanguageToolSpellCheckService } from "@service/spell-check/LanguageToolSpellCheckService";
import { ReactiveCachedDecorator } from "@service/spell-check/ReactiveCachedDecorator";

export async function main() {
  const io = new StdIO("> ");
  const session = new Session();
  const spellChecker = new ReactiveCachedDecorator(
    new LanguageToolSpellCheckService()
  );
  const printer = new Printer();
  const parser = new CheerioParserService();
  const factory = new CommandFactory(
    session,
    io,
    spellChecker,
    printer,
    parser
  );
  const userInputParser = new UserCommandInputParser(factory);
  await factory.create("init-session").execute();

  while (true) {
    io.printLine("Enter a command:");
    const input = await io.readLine();

    if (!input) continue;
    try {
      io.printLine("");
      await userInputParser.parse(input).execute();
      io.printLine("(success)\n");
    } catch (e) {
      if (e instanceof Error) io.printLine("(error) " + e.message + "\n");
      else
        io.printLine(
          "(error) An unknown error occurred while executing the command.\n"
        );
    }
  }
}

main();
