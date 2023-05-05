declare module "system" {
  export const programArgs: System["programArgs"];
  export const programInvocationName: System["programInvocationName"];
  export const programPath: System["programPath"];
  export const version: System["version"];
  export const exit: System["exit"];
  export const addressOf: System["addressOf"];
  export const addressOfGObject: System["addressOfGObject"];
  export const breakpoint: System["breakpoint"];
  export const clearDateCaches: System["clearDateCaches"];
  export const dumpHeap: System["dumpHeap"];
  export const dumpMemoryInfo: System["dumpMemoryInfo"];
  export const gc: System["gc"];
  export const refcount: System["refcount"];

  const System: System;
  export default System;
}
