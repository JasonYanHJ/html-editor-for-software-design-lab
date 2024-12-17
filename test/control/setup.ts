import { CommandFactory } from "@control/CommandFactory";
import { Session } from "@core/Session";
import { ListIO } from "@io/ListIO";
import { CheerioParserService } from "@service/parser/CheerioParserService";
import { Printer } from "@service/printer/Printer";
import { LanguageToolSpellCheckService } from "@service/spell-check/LanguageToolSpellCheckService";

export let input: string[], output: string[];
export let factory: CommandFactory;
export let session: Session;

beforeEach(() => {
  input = [];
  output = [];
  session = new Session();
  const io = new ListIO(input, output);
  factory = new CommandFactory(
    session,
    io,
    new LanguageToolSpellCheckService(),
    new Printer(),
    new CheerioParserService()
  );
});
