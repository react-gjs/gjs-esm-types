declare module "gi" {
  import Atk from "gi://Atk?version=1.0";
  import GLib from "gi://GLib?version=2.0";
  import GModule from "gi://GModule?version=2.0";
  import GObject from "gi://GObject?version=2.0";
  import Gdk3 from "gi://Gdk?version=3.0";
  import Gdk4 from "gi://Gdk?version=4.0";
  import GdkPixbuf from "gi://GdkPixbuf?version=2.0";
  import Gio from "gi://Gio?version=2.0";
  import Graphene from "gi://Graphene?version=1.0";
  import Gsk from "gi://Gsk?version=4.0";
  import Gtk3 from "gi://Gtk?version=3.0";
  import Gtk4 from "gi://Gtk?version=4.0";
  import HarfBuzz from "gi://HarfBuzz?version=0.0";
  import Pango from "gi://Pango?version=1.0";
  import PangoCairo from "gi://PangoCairo?version=1.0";
  import Soup2 from "gi://Soup?version=2.4";
  import Soup3 from "gi://Soup?version=3.0";
  import cairo from "gi://cairo?version=1.0";
  import freetype2 from "gi://freetype2?version=2.0";
  import xlib from "gi://xlib?version=2.0";

  interface GI {
    require(namespace: "Atk", version?: string): typeof Atk;
    require(namespace: "cairo", version?: string): typeof cairo;
    require(namespace: "freetype2", version?: string): typeof freetype2;
    require(namespace: "Gdk", version: "3.0"): typeof Gdk3;
    require(namespace: "Gdk", version: "4.0"): typeof Gdk4;
    require(namespace: "Gdk"): typeof Gdk4;
    require(namespace: "GdkPixbuf", version?: string): typeof GdkPixbuf;
    require(namespace: "Gio", version?: string): typeof Gio;
    require(namespace: "GLib", version?: string): typeof GLib;
    require(namespace: "GModule", version?: string): typeof GModule;
    require(namespace: "GObject", version?: string): typeof GObject;
    require(namespace: "Graphene", version?: string): typeof Graphene;
    require(namespace: "Gsk", version?: string): typeof Gsk;
    require(namespace: "Gtk", version: "3.0"): typeof Gtk3;
    require(namespace: "Gtk", version: "4.0"): typeof Gtk4;
    require(namespace: "Gtk"): typeof Gtk4;
    require(namespace: "HarfBuzz", version?: string): typeof HarfBuzz;
    require(namespace: "Pango", version?: string): typeof Pango;
    require(namespace: "PangoCairo", version?: string): typeof PangoCairo;
    require(namespace: "Soup", version: "2.4"): typeof Soup2;
    require(namespace: "Soup", version: "3.0"): typeof Soup3;
    require(namespace: "Soup"): typeof Soup3;
    require(namespace: "xlib", version?: string): typeof xlib;
    require(namespace: string, version?: string): any;
  }

  const Gi: GI;

  export default Gi;
}
