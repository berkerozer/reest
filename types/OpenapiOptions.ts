export interface OpenapiOptions {
  documentationPath?: string;
  openapi?: string;
  info?: {
    description?: string;
    version?: string;
    title?: string;
  };
  host?: string;
  basePath?: string;
  schemes?: string[];
  definitions?: any;
  paths?: any;
}
