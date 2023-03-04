import type GLib from "gi://GLib?version=2.0";
import type GObject from "gi://GObject?version=2.0";

/**
 * GModule-2.0
 */

declare namespace GModule {
  export enum ModuleError {
    FAILED,
    CHECK_FAILED,
  }
  export enum ModuleFlags {
    LAZY,
    LOCAL,
    MASK,
  }
  export function module_build_path(
    directory: string | null,
    module_name: string
  ): string;
  export function module_error(): string;
  export function module_error_quark(): GLib.Quark;
  export function module_supported(): boolean;
  export interface ModuleCheckInit {
    (module: Module): string;
  }
  export interface ModuleUnload {
    (module: Module): void;
  }
  export class Module {
    /* Methods of GModule.Module */
    close(): boolean;
    make_resident(): void;
    name(): string;
    symbol(
      symbol_name: string
    ): [/* returnType */ boolean, /* symbol */ object | null];
    static name: string;
    static build_path(directory: string | null, module_name: string): string;
    static error(): string;
    static error_quark(): GLib.Quark;
    static supported(): boolean;
  }
}

declare module "gi://GModule?version=2.0" {
  export default GModule;
}
