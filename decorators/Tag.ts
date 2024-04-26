export const Tag = (tag: string = ""): ClassDecorator => {
  return (constructor: Function) => {
    Reflect.defineMetadata("tag", tag, constructor);
  };
};
