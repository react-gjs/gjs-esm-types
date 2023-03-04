import type GObject from "gi://GObject?version=2.0";

/**
 * freetype2-2.0
 */

declare namespace freetype2 {
  export function library_version(): void;
  export class Bitmap {
    static name: string;
  }
  export class Face {
    static name: string;
  }
  export class Library {
    static name: string;
  }
  type Int32 = any;
}

declare module "gi://freetype2?version=2.0" {
  export default freetype2;
}
