import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import "reflect-metadata";
import express, { Request } from "express";
import { RouteDefinition } from "./RouteDefinition";
import { Log } from "../utils/Log";
import SwaggerUi from "swagger-ui-express";
import { pathFormatter } from "../utils/PathFormatter";
import * as js2xmlparser from "js2xmlparser";

export abstract class App {
  private Controllers: any[] = [];
  private Middlewares: any[] = [];
  private swaggerOptions: any = {};
  private multerOptions: any = {};

  constructor(private readonly app = express(), private readonly port = 3000) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.Controllers = Reflect.getMetadata("Controllers", this.constructor);
    this.Middlewares = Reflect.getMetadata(
      "Middlewares",
      this.constructor
    )?.map((middleware: any) => new middleware().use);
    this.swaggerOptions =
      Reflect.getMetadata("swagger-options", this.constructor) || {};

    this.multerOptions = {};

    this.Controllers?.forEach((controller) => {
      const prefix = Reflect.getMetadata("prefix", controller);
      const routes = Reflect.getMetadata("routes", controller);

      const instance = new controller();

      routes.forEach((route: RouteDefinition) => {
        const paramsMetadata =
          Reflect.getOwnMetadata(
            `__routeParameters__${route.methodName as string}`,
            controller.prototype,
            route.methodName
          ) || [];

        const bodyMetadata =
          Reflect.getOwnMetadata(
            `__bodyParameter__${route.methodName as string}`,
            controller.prototype,
            route.methodName
          ) || [];

        const queryMetedata =
          Reflect.getOwnMetadata(
            `__queryParameters__${route.methodName as string}`,
            controller.prototype,
            route.methodName
          ) || [];

        if (route.requestMethod) {
          this.swaggerOptions.paths[pathFormatter(prefix + route.path)] = {
            ...this.swaggerOptions.paths[pathFormatter(prefix + route.path)],
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
                    schema: param.options?.schema || {
                      type: "string",
                    },
                  })
                ),
            },
          };

          bodyMetadata.forEach((param: any) => {
            new param.options.type();

            if (route.multer) {
              this.multerOptions[param.options.type.name] = route.multer;
            }

            this.swaggerOptions.paths[pathFormatter(prefix + route.path)][
              route.requestMethod!
            ].requestBody = {
              content: {
                [route.multer ? "multipart/form-data" : "application/json"]: {
                  schema: {
                    $ref: `#/components/schemas/${param.options.type.name}`,
                  },
                },
              },
            };
          });

          this.app[route.requestMethod](
            `${prefix}${route.path}`,
            this.Middlewares
              ? route.middlewares
                ? [...this.Middlewares, ...route.middlewares]
                : this.Middlewares
              : route.middlewares || [],
            async (req: express.Request, res: express.Response) => {
              try {
                const args = this.extractParameters(
                  req,
                  paramsMetadata.concat(queryMetedata).concat(bodyMetadata),
                  {
                    multer: route.multer && {
                      path: route.multer.path,
                      single: route.multer.single,
                    },
                  }
                );

                const result = await instance[route.methodName](...args);

                if (req.headers.accept === "application/xml") {
                  res.setHeader("Content-Type", "application/xml");
                  const xml = js2xmlparser.parse("data", result);
                  return res.send(xml);
                }

                res.json(result);
              } catch (error: any) {
                res.status(500).json({ error: error.message });
              }
            }
          );
        }
      });
    });

    const schemas = validationMetadatasToSchemas();

    console.log(schemas);
    console.log(this.multerOptions);

    Object.keys(this.multerOptions).forEach((key) => {
      schemas[key].properties![this.multerOptions[key].path] = {
        type: "string",
        format: "binary",
      };
    });

    this.swaggerOptions.components = {
      schemas: {
        ...schemas,
      },
    };

    if (Reflect.hasMetadata("swagger", this.constructor)) {
      (async () => {
        this.app.use(
          Reflect.getMetadata("swagger", this.constructor),
          SwaggerUi.serveWithOptions({
            redirect: false,
          })
        );
        this.app.get(
          Reflect.getMetadata("swagger", this.constructor),
          SwaggerUi.setup(this.swaggerOptions)
        );
        this.app.get(
          Reflect.getMetadata("swagger", this.constructor) + "/swagger.json",
          (req: express.Request, res: express.Response) => {
            res.json(this.swaggerOptions);
          }
        );
      })();
    }

    process.env.NODE_ENV === "local" &&
      this.app.listen(this.port, () => {
        Log(`Server is running on PORT:${this.port || 3000}`);
        console.log(
          `-------------------------------------------------------------`
        );
      });
  }

  extractParameters(
    req: Request,
    paramsMetadata: Array<{
      paramName: string;
      parameterIndex: number;
      type: string;
    }>,
    options: any
  ) {
    const args = [];

    for (const { type, paramName, parameterIndex } of paramsMetadata) {
      switch (type) {
        case "param":
          args[parameterIndex] =
            paramName?.length > 0 ? req.params[paramName] : req.params;
          break;
        case "body":
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
          args[parameterIndex] =
            paramName?.length > 0 ? req.query[paramName] : req.query;
          break;
      }
    }
    return args;
  }

  getApplication() {
    return this.app;
  }
}
