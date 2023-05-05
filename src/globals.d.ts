declare function print(message: any): void;
declare function printerr(error: any): void;
declare function log(message?: string): void;
declare function logError(exception: any, message?: string): void;

declare interface Pkg {
  /**
   * Initialize directories and global variables. Must be called
   * before any of other API in Package is used. `params` must be
   * an object with at least the following keys:
   *
   * - Name: the package name ($(PACKAGE_NAME) in autotools, eg.
   *   org.foo.Bar)
   * - Version: the package version
   * - Prefix: the installation prefix
   *
   * Init() will take care to check if the program is running
   * from the source directory or not, by looking for a 'src'
   * directory.
   *
   * At the end, the global variable 'pkg' will contain the
   * Package module (imports.package).
   */
  init(
    options: Pick<Pkg, "name" | "version" | "prefix"> &
      Partial<Pick<Pkg, "libdir">>
  ): void;
  /**
   * This is a convenience function if your package has a single
   * entry point. You must define a main(ARGV) function inside a
   * main.js module in moduledir.
   */
  start(
    options: Pick<Pkg, "name" | "version" | "prefix"> &
      Partial<Pick<Pkg, "libdir">>
  ): void;
  /**
   * This is the function to use if you want to have multiple
   * entry points in one package. You must define a main(ARGV)
   * function inside the passed in module, and then the launcher
   * would be:
   *
   * @example
   *   imports.package.init(...);
   *   imports.package.run(imports.entrypoint);
   */
  run(module: { main(argv: string[]): void }): number | undefined;
  /**
   * Mark a dependency on a specific version of one or more
   * external GI typelibs. `libs` must be an object whose keys
   * are a typelib name, and values are the respective version.
   * The empty string indicates any version.
   *
   * @param libs The external dependencies to import as a
   *   dictionary of name:version pairs.
   */
  require(libs: Record<string, string>): void;
  /**
   * As checkSymbol(), but exit with an error if the dependency
   * cannot be satisfied.
   *
   * @param lib An external dependency to import
   * @param ver Version of the dependency
   * @param symbol Symbol to check for
   */
  requireSymbol(lib: string, ver: string, symbol?: string): void;
  /**
   * Check whether an external GI typelib can be imported and
   * provides @symbol.
   *
   * Symbols may refer to
   *
   * - Global functions ('main_quit')
   * - Classes ('Window')
   * - Class / instance methods ('IconTheme.get_default' /
   *   'IconTheme.has_icon')
   * - GObject properties ('Window.default_height')
   *
   * @param lib An external dependency to import
   * @param ver Version of the dependency
   * @param symbol Symbol to check for
   * @returns True if `lib` can be imported and provides
   *   `symbol`, false otherwise
   */
  checkSymbol(lib: string, ver: string, symbol?: string): boolean;
  initFormat(): void;
  initGettext(): void;
  initSubmodule(moduleName: string): void;

  /** The base name of the entry point (eg. org.foo.Bar.App) */
  name: string;
  /** The package version */
  version: string;
  /** The installation prefix */
  prefix: string;
  /**
   * The final libdir when installed; usually, these would be
   * `${prefix}/lib` (or '/lib64')
   */
  libdir?: string;
  /**
   * The final datadir when installed; usually, these would be
   * '${prefix}//share'
   */
  datadir?: string;
  /**
   * The directory to look for private data files, such as
   * images, stylesheets and UI definitions; this will be
   * datadir
   *
   * - Name when installed and './data' when running from the
   *   source tree
   */
  pkgdatadir: string;
  /**
   * The directory to look for private typelibs and C libraries;
   * this will be libdir + name when installed and './lib' when
   * running from the source tree
   */
  pkglibdir: string;
  /**
   * The directory to look for JS modules; this will be pkglibdir
   * when installed and './src' when running from the source
   * tree
   */
  moduledir: string;
  /**
   * The directory containing gettext translation files; this
   * will be datadir + '/locale' when installed and './po' in the
   * source tree
   */
  localedir: string;
}

type Source = import("gi://GLib?version=2.0").default.Source;

declare interface MainLoop {
  quit(name: string): void;
  run(name: string): void;
  idle_source(handler: () => any, priority: number): Source;
  idle_add(handler: () => any, priority: number): number;
  timeout_source(timeout: number, handler: () => any, priority: number): Source;
  timeout_seconds_source(
    timeout: number,
    handler: () => any,
    priority: number
  ): Source;
  timeout_add(timeout: number, handler: () => any, priority: number): Source;
  timeout_add_seconds(
    timeout: number,
    handler: () => any,
    priority: number
  ): Source;
  source_remove(id: number): boolean;
}

declare interface Lang {
  /** Counts all the iterable keys within the given object. */
  countProperties(obj: Iterable<any>): number;
  /**
   * Retrieves the property descriptor of the given property of
   * the given object, or if not defined on the object, its
   * prototype chain.
   */
  getPropertyDescriptor(
    obj: object,
    property: string | symbol
  ): PropertyDescriptor;
  /**
   * Copies all iterable properties of the source object to the
   * target object. If a property already exists on the target,
   * it is overwritten.
   */
  copyProperties(source: object, target: object): void;
  /**
   * Copies all iterable properties of the source object to the
   * target object, excluding the properties which name starts
   * with an underscore (`_`). If a property already exists on
   * the target, it is overwritten.
   */
  copyPublicProperties(source: object, target: object): void;
  /**
   * Binds obj to callback. Makes it possible to refer to "obj"
   * using this within the callback.
   *
   * @param obj The object to bind
   * @param callback Callback to bind obj in
   * @param bindArguments Additional arguments to the callback
   * @returns A new callback
   */
  bind<F extends Function>(
    obj: object,
    callback: F,
    ...bindArguments: any[]
  ): F;
}

declare class JsUnitException extends Error {
  constructor(comment: string, message: string);
}

declare interface Tracer {
  warn(...args: [any, any]): void;
  inform(...args: [any, any]): void;
  info(...args: [any, any]): void;
  debug(...args: [any, any]): void;
}

declare interface JsUnit {
  JSUNIT_UNDEFINED_VALUE: undefined;
  JSUNIT_VERSION: string;
  isTestPageLoaded: boolean;
  top: any;
  fail(failureMessage: string): never;
  error(errorMessage: string): never;
  argumentsIncludeComments(
    expectedNumberOfNonCommentArgs: number,
    args: any[]
  ): boolean;
  commentArg<T>(expectedNumberOfNonCommentArgs: number, args: T[]): T | null;
  nonCommentArg<T>(
    desiredNonCommentArgIndex: number,
    expectedNumberOfNonCommentArgs: number,
    args: T[]
  ): T | undefined;
  assert(...args: [any]): void;
  assertTrue(...args: [any]): void;
  assertFalse(...args: [any]): void;
  assertEquals(...args: [any, any]): void;
  assertNotEquals(...args: [any, any]): void;
  assertNull(...args: [any]): void;
  assertNotNull(...args: [any]): void;
  assertUndefined(...args: [any]): void;
  assertNotUndefined(...args: [any]): void;
  assertNaN(...args: [any]): void;
  assertNotNaN(...args: [any]): void;
  assertRaises(...args: [Function]): void;
  isLoaded(): boolean;
  setUp(): void;
  tearDown(): void;
  getFunctionName(aFunction: Function): string;
  parseErrorStack(excp?: { stack?: string }): string[];
  JsUnitException: typeof JsUnitException;
  warn(...args: [any, any]): void;
  inform(...args: [any, any]): void;
  info(...args: [any, any]): void;
  debug(...args: [any, any]): void;
  setjsUnitTracer(ajsUnitTracer: any): void;
  trim(str: string): string;
  trim(str: null): null;
  isBlank(str: string): boolean;
  push<T>(anArray: T[], anObject: T): void;
  jsUnitGetParm(name: string): string | null;
  newOnLoadEvent(): void;
  jsUnitSetOnLoad(windowRef: any, onloadHandler: Function): void;
  /**
   * GJS: entry point to run all functions named as test*,
   * surrounded by /* calls to setUp() and tearDown()
   */
  gjstestRun(
    window_: Record<string, Function>,
    setUp?: Function,
    tearDown?: Function
  ): void;
}

declare interface Gi {
  Atk: typeof import("gi://Atk?version=1.0").default;
  GLib: typeof import("gi://GLib?version=2.0").default;
  GModule: typeof import("gi://GModule?version=2.0").default;
  GObject: typeof import("gi://GObject?version=2.0").default;
  Gdk: typeof import("gi://Gdk?version=4.0").default;
  GdkPixbuf: typeof import("gi://GdkPixbuf?version=2.0").default;
  Gio: typeof import("gi://Gio?version=2.0").default;
  Graphene: typeof import("gi://Graphene?version=1.0").default;
  Gsk: typeof import("gi://Gsk?version=4.0").default;
  Gtk: typeof import("gi://Gtk?version=4.0").default;
  HarfBuzz: typeof import("gi://HarfBuzz?version=0.0").default;
  Pango: typeof import("gi://Pango?version=1.0").default;
  PangoCairo: typeof import("gi://PangoCairo?version=1.0").default;
  Soup: typeof import("gi://Soup?version=3.0").default;
  cairo: typeof import("gi://cairo?version=1.0").default;
  freetype2: typeof import("gi://freetype2?version=2.0").default;
  xlib: typeof import("gi://xlib?version=2.0").default;
  [key: string]: any;
}

declare interface Gettext {
  LocaleCategory: {
    ALL: 6;
    COLLATE: 3;
    CTYPE: 0;
    MESSAGES: 5;
    MONETARY: 4;
    NUMERIC: 1;
    TIME: 2;
  };
  bindtextdomain(...args: any[]): any;
  dcgettext(...args: any[]): any;
  dgettext(...args: any[]): any;
  dngettext(...args: any[]): any;
  domain(...args: any[]): any;
  dpgettext(...args: any[]): any;
  gettext(...args: any[]): any;
  ngettext(...args: any[]): any;
  pgettext(...args: any[]): any;
  setlocale(...args: any[]): any;
  textdomain(...args: any[]): any;
}

declare interface Format {
  vprintf(format: string, args: any[]): string;
  printf(format: string, ...args: any[]): void;
  /*
   * This function is intended to extend the String object and provide a
   * String.format API for string formatting.
   * It has to be set up using String.prototype.format = Format.format;
   * Usage:
   * "somestring %s %d".format('hello', 5);
   * It supports %s, %d, %x and %f.
   * For %f it also supports precisions like "%.2f".format(1.526).
   * All specifiers can be prefixed with a minimum field width, e.g.
   * "%5s".format("foo").
   * Unless the width is prefixed with '0', the formatted string will be padded
   * with spaces.
   */
  format(format: string, ...args: any[]): string;
}

declare class ByteArray {
  constructor(arg?: number);

  static get<T extends object, P extends string | number>(
    target: T,
    prop: P,
    receiver?: unknown
  ): P extends keyof T ? T[P] : any;

  static set<T extends object, P extends string | number>(
    target: T,
    propertyKey: P,
    value: P extends keyof T ? T[P] : any,
    receiver?: any
  ): boolean;

  length: number;

  toString(encoding: string): string;

  toGBytes(): import("gi://GLib?version=2.0").default.Bytes;
}

declare interface ByteArrayImport {
  ByteArray: typeof ByteArray;
  fromArray(array: Iterable<number>): ByteArray;
  toGBytes(array: Uint8Array): import("gi://GLib?version=2.0").default.Bytes;
}

declare type GObject = import("gi://GObject?version=2.0").default.Object;

declare interface System {
  programArgs: string[];
  programInvocationName: string;
  programPath: string;
  version: string;
  exit(code: number): void;
  addressOf(object: object): string;
  addressOfGObject(object: GObject): string;
  breakpoint(): void;
  clearDateCaches(): void;
  dumpHeap(filename: string): void;
  dumpMemoryInfo(filename: string): void;
  gc(): void;
  refcount(o: GObject): number;
}

declare const imports: {
  mainloop: MainLoop;
  package: Pkg;
  lang: Lang;
  jsUnit: JsUnit;
  gi: Gi;
  gettext: Gettext;
  format: Format;
  byteArray: ByteArrayImport;
  system: System;
};

declare const ARGV: string[];
