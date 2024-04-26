import { Log } from "../utils/Log";

export const Swagger = (path: string): ClassDecorator => {
  const swaggerOptions = {
    openapi: "3.0.3",
    info: {
      description: "My API Documentation",
      version: "1.0.0",
      title: "My API",
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ["http", "https"],
    definitions: {},
    paths: {},
  };

  return (constructor: Function) => {
    Log(`Swagger is registered at ${path}`);
    Reflect.defineMetadata("swagger", path, constructor);
    Reflect.defineMetadata("swagger-options", swaggerOptions, constructor);
  };
};
