#### This package provides module declarations for some of the most common GJS gir modules (see [Gnome JavaScript](https://gjs.guide/about/)). With it you will get fully typed imports for the following modules:

- `gi://Atk?version=1.0`
- `gi://GLib?version=2.0`
- `gi://GModule?version=2.0`
- `gi://GObject?version=2.0`
- `gi://Gdk?version=3.0`
- `gi://Gdk?version=4.0`
- `gi://GdkPixbuf?version=2.0`
- `gi://Gio?version=2.0`
- `gi://Graphene?version=1.0`
- `gi://Gsk?version=4.0`
- `gi://Gtk?version=3.0`
- `gi://Gtk?version=4.0`
- `gi://HarfBuzz?version=0.0`
- `gi://Pango?version=1.0`
- `gi://PangoCairo?version=1.0`
- `gi://Soup?version=2.4`
- `gi://Soup?version=3.0`
- `gi://cairo?version=1.0`
- `gi://freetype2?version=2.0`
- `gi://xlib?version=2.0`

Additionally a module declaration for `system` module is included as well as some global functions and variables like `globalThis.print()`, `globalThis.imports`, `globalThis.pkg` etc.

# Use

1. Install this package via npm or yarn
2. Add this package to the tsconfig.json typeRoots:
   ```json tsconfig.json
   {
     "compilerOptions": {
       "typeRoots": ["node_modules/gjs-esm-types", "node_modules/@types"]
     }
   }
   ```
3. `gi` imports should now be correctly typed:

   ```ts
   import Gtk from "gi://Gtk?version=3.0";

   const window = new Gtk.Window();
   // Resolved Type - const window: Gtk.Window;
   ```

# Imports without version specifier

This package only provides module declarations for imports with a version specifier. If you want your imports to not include the version, add a `.d.ts` file in your project and define the module declarations in there, similarly to this:

### Example 1 - Gtk

```ts
declare module "gi://Gtk" {
  import Gtk from "gi://Gtk?version=4.0";
  export default Gtk;
}
```

### Example 2 - GLib

```ts
declare module "gi://GLib" {
  import GLib from "gi://GLib?version=2.0";
  export default GLib;
}
```

### Example 3 - Soup

```ts
declare module "gi://Soup" {
  import Soup from "gi://Soup?version=2.4";
  export default Soup;
}
```
