export const PORT = (port?: number | string): ClassDecorator => {
  if (!port) {
    return (constructor: Function) => {
      Reflect.defineMetadata("port", 3000, constructor);
    };
  }
  return (constructor: Function) => {
    Reflect.defineMetadata("port", +port, constructor);
  };
};
