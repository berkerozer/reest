import { generateRequestMethodDecorathor } from "./generators/generateMethodDecorator";

export const Get = (path: string, options?: any) =>
  generateRequestMethodDecorathor("get", path, options);

export const Post = (path: string, options?: any) =>
  generateRequestMethodDecorathor("post", path, options);

export const Put = (path: string, options?: any) =>
  generateRequestMethodDecorathor("put", path, options);

export const Patch = (path: string, options?: any) =>
  generateRequestMethodDecorathor("patch", path, options);

export const Delete = (path: string, options?: any) =>
  generateRequestMethodDecorathor("delete", path, options);
