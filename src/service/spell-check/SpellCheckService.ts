export interface SpellCheckService {
  check(text: string): Promise<string[]>;
}
