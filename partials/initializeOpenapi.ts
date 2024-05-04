import { Application, Request, Response } from "express";
import SwaggerUi from "swagger-ui-express";
import { OpenapiOptions } from "../types";

export const initializeOpenapi = (
  app: Application,
  options: OpenapiOptions
) => {
  const openapiPath = options.documentationPath as string;
  (async () => {
    app.use(
      openapiPath,
      SwaggerUi.serveWithOptions({
        redirect: false,
      })
    );
    app.get(openapiPath, SwaggerUi.setup(options));
    app.get(openapiPath + "/swagger.json", (req: Request, res: Response) => {
      res.json(options);
    });
  })();
};
