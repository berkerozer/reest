import { Request } from "express";

export interface Interceptor {
  data?: any;
  intercept(req: Request): void;
  complete(): void;
}
