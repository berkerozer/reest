import { Log } from "../../utils/Log";
import { OpenapiOptions } from "../../types";

export const Openapi = (
  path?: string,
  options?: OpenapiOptions
): ClassDecorator => {
  const globalOpenapiOptions = {
    documentationPath: path || "/api-docs",
    openapi: options?.openapi || "3.0.3",
    info: {
      description: options?.info?.description || "My API description",
      version: options?.info?.version || "1.0.0",
      title: options?.info?.title || "Cats API",
    },
    host: options?.host || "localhost:8080",
    basePath: options?.basePath || "/",
    schemes: options?.schemes || ["http", "https"],
    definitions: options?.definitions || {},
    paths: options?.paths || {},
  };

  return (constructor: Function) => {
    Log(`Openapi is registered at ${path}`);
    Reflect.defineMetadata(
      "openapi-options",
      globalOpenapiOptions,
      constructor
    );
  };
};
