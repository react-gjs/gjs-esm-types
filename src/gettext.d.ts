declare module "gettext" {
  export const LocaleCategory: Gettext["LocaleCategory"];
  export const setlocale: Gettext["setlocale"];
  export const textdomain: Gettext["textdomain"];
  export const bindtextdomain: Gettext["bindtextdomain"];
  export const gettext: Gettext["gettext"];
  export const dgettext: Gettext["dgettext"];
  export const dcgettext: Gettext["dcgettext"];
  export const ngettext: Gettext["ngettext"];
  export const dngettext: Gettext["dngettext"];
  export const pgettext: Gettext["pgettext"];
  export const dpgettext: Gettext["dpgettext"];
  export const domain: Gettext["domain"];

  const gettext: Gettext;
  export default gettext;
}
