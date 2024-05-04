export {};
declare global {
  namespace Express {
    interface Request {
      meta?: any;
    }
  }
}
