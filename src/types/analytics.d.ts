export {}; // make this a module

type Gtag = (
  ...args:
    | ["js", Date]
    | ["config", string, Record<string, unknown>?]
    | ["event", string, Record<string, unknown>?]
    | ["consent", "update", Record<string, unknown>]
    | ["set", Record<string, unknown>]
) => void;

declare global {
  // Official lowercase global from gtag.js
  var gtag: Gtag | undefined;

  // If you truly use an uppercase alias somewhere:
  const GTAG: Gtag;
}
