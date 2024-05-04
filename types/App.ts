import "reflect-metadata";
import express from "express";

import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { defaultMetadataStorage } from "class-transformer/cjs/storage.js";

import { Log } from "../utils";
import { Interceptor, OpenapiOptions } from ".";
import { initializeOpenapi } from "../partials";

export abstract class App {
  //Define Controllers and Global Middlewares
  private Controllers: any[] = [];
  private Middlewares: any[] = [];

  //Define Interceptors
  private Interceptors: { new (): Interceptor }[];

  //Define App Options
  private openapiOptions: OpenapiOptions = {};
  //private multerOptions: any = {};
  private serverless = false;
  private port: number;

  //Option getters and setters
  private setPort(port?: number) {
    this.port = port || 3000;
  }
  public getPort() {
    return this.port;
  }
  public isServerless() {
    return this.serverless;
  }
  private setOpenapiOptions(options?: any) {
    this.openapiOptions = options;
  }
  private joinDefinitions(definitions: any) {
    this.openapiOptions.definitions = {
      ...this.openapiOptions.definitions,
      ...definitions,
    };
  }
  private joinPaths(paths: any) {
    this.openapiOptions.paths = {
      ...this.openapiOptions.paths,
      ...paths,
    };
  }
  public getOpenapiOptions() {
    return this.openapiOptions;
  }
  //Get the express application instance
  getApplication() {
    return this.app;
  }

  //Define Schemas for Swagger
  private schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
  });

  constructor(private readonly app = express()) {
    //Set options before the construction (App Level Decorators)
    //Set the port from the metadata
    this.setPort(Reflect.getMetadata("port", this.constructor));
    this.setOpenapiOptions(
      Reflect.getMetadata("openapi-options", this.constructor)
    );
    //Set the definitions for the openapi settings
    this.joinDefinitions(this.schemas);
    this.joinDefinitions({
      File: {
        type: "string",
        format: "binary",
      },
    });

    //Collect Global Interceptors
    this.Interceptors = Reflect.getMetadata(
      "GlobalInterceptors",
      this.constructor
    );

    //Initialize the global interceptors
    this.Interceptors?.sort((a, b) => -1).forEach((interceptor) => {
      this.app.use((req, _, next) => {
        const req_interceptor = new interceptor();
        req_interceptor.intercept(req);
        req.meta = {
          ...req.meta,
          [interceptor.name]: req_interceptor.data,
        };
        next();
      });
    });
    //Initialize Global Parser Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //Collect the controllers and global middlewares
    this.Controllers = Reflect.getMetadata("Controllers", this.constructor);
    this.Middlewares = Reflect.getMetadata("Middlewares", this.constructor);

    //Initialize controllers
    this.Controllers?.forEach((controller) => {
      controller = new controller(this.constructor);
      this.joinPaths(controller.openapiPaths);
      app.use(controller.prefix, controller.router);
    });

    //Initialize Middlewares
    this.Middlewares?.forEach((middleware) => {
      //this.app.use(middleware);
    });

    //Initialize Openapi Documentation
    this.getOpenapiOptions().openapi &&
      initializeOpenapi(this.app, this.getOpenapiOptions());

    //Start the server if not in serverless environment
    !(this.isServerless() && process.env.NODE_ENV !== "local") &&
      this.app.listen(this.getPort(), () => {
        Log(`Server is running on PORT:${this.port}`);
        console.log(
          `-------------------------------------------------------------`
        );
      });
  }
}
