import { Router, Request, Response } from "express";

import * as js2xmlparser from "js2xmlparser";

import { RouteDefinition } from "../types";
import { pathFormatter } from "../utils";

export abstract class Controller {
  Middlewares: any[] = [];

  prefix = Reflect.getMetadata("prefix", this.constructor);
  routes = Reflect.getMetadata("routes", this.constructor);
  openapiPaths: any = {};
  router: any;

  joinMiddlewares(middlewares: any[]) {
    this.Middlewares = [...this.Middlewares, ...middlewares];
  }

  constructor(appContructor: any) {
    this.router = Router();

    this.routes.forEach((route: RouteDefinition, index: number) => {
      // Get the parameters metadata
      const paramsMetadata =
        Reflect.getOwnMetadata(
          `__routeParameters__${route.methodName as string}`,
          this.constructor.prototype,
          route.methodName
        ) || [];

      // Get the body metadata
      const bodyMetadata =
        Reflect.getOwnMetadata(
          `__bodyParameter__${route.methodName as string}`,
          this.constructor.prototype,
          route.methodName
        ) || [];

      // Get the query metadata
      const queryMetedata =
        Reflect.getOwnMetadata(
          `__queryParameters__${route.methodName as string}`,
          this.constructor.prototype,
          route.methodName
        ) || [];

      if (route.requestMethod) {
        // Add the route to the openapi paths
        this.openapiPaths[pathFormatter(this.prefix + route.path)] = {
          ...this.openapiPaths[pathFormatter(this.prefix + route.path)],
          [route.requestMethod]: {
            ...route.openApi,

            parameters: paramsMetadata
              .concat(queryMetedata)
              .map(
                (param: {
                  paramName: string;
                  parameterIndex: number;
                  options: any;
                  type: string;
                }) => ({
                  name: param.paramName,
                  in: param.type === "param" ? "path" : "query",
                  required: param.options?.required === false ? false : true,
                  description: param.options?.description,
                  schema: param.options?.schema,
                })
              ),
          },
        };

        // Add the requestBody to the openapi paths
        bodyMetadata.forEach((param: any) => {
          this.openapiPaths[pathFormatter(this.prefix + route.path)][
            route.requestMethod!
          ].requestBody = {
            content: {
              [route.multer ? "multipart/form-data" : "application/json"]: {
                schema: {
                  $ref: `#/definitions/${param.options.type.name}`,
                },
              },
            },
          };
        });

        // Add the route to the express router
        this.router[route.requestMethod](
          route.path,
          this.Middlewares
            ? route.middlewares
              ? [...this.Middlewares, ...route.middlewares]
              : this.Middlewares
            : route.middlewares || [],
          async (req: Request, res: Response) => {
            try {
              const args = this.extractParameters(
                req,
                paramsMetadata.concat(queryMetedata).concat(bodyMetadata),
                {
                  multer: route.multer && {
                    path: route.multer.path,
                    single: route.multer.type === "single",
                  },
                }
              );

              const result = await this.constructor.prototype[route.methodName](
                ...args
              );

              if (req.headers.accept === "application/xml") {
                res.setHeader("Content-Type", "application/xml");
                const xml = js2xmlparser.parse("data", result);
                return res.send(xml);
              }

              //interceptor
              if (req.meta) {
                const interceptors = Reflect.getMetadata(
                  "GlobalInterceptors",
                  appContructor
                );
                interceptors
                  ?.sort((a: any, b: any) => -1)
                  .forEach((interceptor: any) => {
                    const req_interceptor = new interceptor();
                    req_interceptor.data = req.meta[interceptor.name];
                    req_interceptor.complete();
                  });
              }
              delete req.meta;
              res.json(result);
            } catch (error: any) {
              res.status(500).json({ error: error.message });
            }
          }
        );
      }
    });
  }

  extractParameters(
    req: Request,
    paramsMetadata: Array<{
      isObject?: boolean;
      paramName: string;
      parameterIndex: number;
      type: string;
    }>,
    options: any
  ) {
    const args = [];

    for (const {
      isObject,
      type,
      paramName,
      parameterIndex,
    } of paramsMetadata) {
      const usedIndexes: number[] = [];
      if (usedIndexes.includes(parameterIndex)) {
        break;
      }
      usedIndexes.push(parameterIndex);
      switch (type) {
        case "param":
          if (paramName.length === 0) {
            break;
          }
          args[parameterIndex] = req.params[paramName];
          break;
        case "body":
          console.log("body", options);
          args[parameterIndex] = options.multer
            ? {
                ...req.body,
                [options.multer.path]: options.multer.single
                  ? req.file
                  : req.files,
              }
            : req.body;
          break;
        case "query":
          args[parameterIndex] = isObject ? req.query : req.query[paramName];
          break;
      }
    }
    return args;
  }
}
