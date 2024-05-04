import { Log } from "../../utils/Log";

export const Route = (prefix: string = ""): ClassDecorator => {
  return (constructor: Function) => {
    Log(`${constructor.name} is registered`);
    Reflect.defineMetadata("prefix", prefix, constructor);

    if (!Reflect.hasMetadata("routes", constructor)) {
      Reflect.defineMetadata("routes", [], constructor);
    }
  };
};
