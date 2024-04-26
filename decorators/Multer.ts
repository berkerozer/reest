import { RouteDefinition } from "../types/RouteDefinition";
import multer from "multer";

export const Multer = (path: string, options?: any): MethodDecorator => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const upload = multer({ storage: multer.memoryStorage() });

    const type = "single";

    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    if (!Reflect.hasMetadata("multer", target.constructor)) {
      Reflect.defineMetadata(
        "multer",
        {
          path,
          options,
          single: type === "single",
        },
        target.constructor
      );
    }

    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as Array<RouteDefinition>;

    const route = routes.find((route: any) => route.methodName === key) || {
      methodName: key,
      middlewares: [],
    };

    if (route.middlewares) {
      route.middlewares.push(upload[type](path));
    } else {
      route.middlewares = [upload[type](path)];
    }

    route.multer = {
      path,
      options,
      single: type === "single",
    };

    Reflect.defineMetadata("routes", [...routes, route], target.constructor);
  };
};
