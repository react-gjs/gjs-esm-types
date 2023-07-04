declare module "gi://GLib?version=2.0" {
  interface MainLoop {
    /**
     * Similar to the `run` method.
     *
     * Starts the mainloop once the current module has been
     * initiated, and returns a promise that resolves once the
     * mainloop quits.
     */
    runAsync(): Promise<void>;
  }
}
