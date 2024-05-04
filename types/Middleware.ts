export interface Middleware {
  use(req: any, res: any, next: any): void;
}
