declare module "console" {
  export const DEFAULT_LOG_DOMAIN: string;

  export function getConsoleLogDomain(): string;

  /**
   * Set the GLib log domain for the global console object. The
   * specified domain will be printed into the stdout whenever a
   * console function is invoked.
   *
   * @example
   *   import { setConsoleLogDomain } from "console";
   *
   *   setConsoleLogDomain("My-App");
   *
   *   console.log("Hello World!");
   *   // Output: My-App-Message: 12:03:28.850: "Hello World!"
   *
   * @default "Gjs-Console"
   */
  export function setConsoleLogDomain(domain: string): void;

  export default {
    DEFAULT_LOG_DOMAIN,
    getConsoleLogDomain,
    setConsoleLogDomain,
  };
}
