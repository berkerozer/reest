import { Log } from "../utils/Log";

export const Controller = (prefix: string = ""): ClassDecorator => {
  return (constructor: Function) => {
    Log(`${constructor.name} is registered`);
    Reflect.defineMetadata("prefix", prefix, constructor);

    if (!Reflect.hasMetadata("routes", constructor)) {
      Reflect.defineMetadata("routes", [], constructor);
    }
  };
};
