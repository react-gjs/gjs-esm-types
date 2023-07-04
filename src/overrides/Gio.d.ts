declare module "gi://Gio?version=2.0" {
  interface Application {
    /**
     * Similar to the `run` method.
     *
     * Starts the Application's mainloop once the current module
     * has been initiated, and returns a promise that resolves
     * once the mainloop quits.
     */
    runAsync(argv: string[] | null): Promise<void>;
  }
}
