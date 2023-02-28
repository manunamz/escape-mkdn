// patch typescript's 'RegExpMatchArray'
export interface RegExpMatchResult {
  [n: number]: string;
  groups?: {
    [key: string]: string
  };
  index: number;
  input: string;
}