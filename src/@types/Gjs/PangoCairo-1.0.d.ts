import type cairo from "gi://cairo?version=1.0";
import type Pango from "gi://Pango?version=1.0";
import type HarfBuzz from "gi://HarfBuzz?version=0.0";
import type freetype2 from "gi://freetype2?version=2.0";
import type GObject from "gi://GObject?version=2.0";
import type GLib from "gi://GLib?version=2.0";
import type Gio from "gi://Gio?version=2.0";

/**
 * PangoCairo-1.0
 */

declare namespace PangoCairo {
  export function context_get_font_options(
    context: Pango.Context
  ): cairo.FontOptions | null;
  export function context_get_resolution(context: Pango.Context): number;
  export function context_set_font_options(
    context: Pango.Context,
    options?: cairo.FontOptions | null
  ): void;
  export function context_set_resolution(
    context: Pango.Context,
    dpi: number
  ): void;
  export function context_set_shape_renderer(
    context: Pango.Context,
    func?: ShapeRendererFunc | null
  ): void;
  export function create_context(cr: cairo.Context): Pango.Context;
  export function create_layout(cr: cairo.Context): Pango.Layout;
  export function error_underline_path(
    cr: cairo.Context,
    x: number,
    y: number,
    width: number,
    height: number
  ): void;
  export function font_map_get_default(): Pango.FontMap;
  export function font_map_new(): Pango.FontMap;
  export function font_map_new_for_font_type(
    fonttype: cairo.FontType
  ): Pango.FontMap | null;
  export function glyph_string_path(
    cr: cairo.Context,
    font: Pango.Font,
    glyphs: Pango.GlyphString
  ): void;
  export function layout_line_path(
    cr: cairo.Context,
    line: Pango.LayoutLine
  ): void;
  export function layout_path(cr: cairo.Context, layout: Pango.Layout): void;
  export function show_error_underline(
    cr: cairo.Context,
    x: number,
    y: number,
    width: number,
    height: number
  ): void;
  export function show_glyph_item(
    cr: cairo.Context,
    text: string,
    glyph_item: Pango.GlyphItem
  ): void;
  export function show_glyph_string(
    cr: cairo.Context,
    font: Pango.Font,
    glyphs: Pango.GlyphString
  ): void;
  export function show_layout(cr: cairo.Context, layout: Pango.Layout): void;
  export function show_layout_line(
    cr: cairo.Context,
    line: Pango.LayoutLine
  ): void;
  export function update_context(
    cr: cairo.Context,
    context: Pango.Context
  ): void;
  export function update_layout(cr: cairo.Context, layout: Pango.Layout): void;
  export interface ShapeRendererFunc {
    (cr: cairo.Context, attr: Pango.AttrShape, do_path: boolean): void;
  }
  export class Font {
    /* Methods of PangoCairo.Font */
    get_scaled_font(): cairo.ScaledFont | null;
    static name: string;
  }
  export class FontMap {
    /* Methods of PangoCairo.FontMap */
    get_font_type(): cairo.FontType;
    get_resolution(): number;
    set_default(): void;
    set_resolution(dpi: number): void;
    static name: string;
    static get_default(): Pango.FontMap;
    static new_for_font_type(fonttype: cairo.FontType): Pango.FontMap | null;
  }
}

declare module "gi://PangoCairo?version=1.0" {
  export default PangoCairo;
}
