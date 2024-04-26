import { RouteDefinition } from "../../types/RouteDefinition";

export const generateRequestMethodDecorathor = (
  type: RouteDefinition["requestMethod"],
  path: string,
  options?: any
): MethodDecorator => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as Array<RouteDefinition>;

    const route = routes.find((route: any) => route.methodName === key) || {
      methodName: key,
      middlewares: [],
    };

    route.requestMethod = type;
    route.path = path;
    route.openApi = {
      operationId:
        target.constructor.name + "__" + key.toString() + "__" + type,
      description: options?.description,
      tags: [target.constructor.name],
      requestBody: ["post", "put", "patch"].includes(type as string) && {
        description: options?.bodyDescription || "Request body",
        required: options?.bodyRequired || false,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      produces: ["application/json", "application/xml"],
      responses: {
        200: {
          description: "OK",
        },
      },
    };

    Reflect.defineMetadata("routes", [...routes, route], target.constructor);
  };
};
