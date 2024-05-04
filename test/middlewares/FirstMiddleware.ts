export class FirstMiddleware {
  use(req: any, res: any, next: any): void {
    console.log("FirstMiddleware");
    next();
  }
}
