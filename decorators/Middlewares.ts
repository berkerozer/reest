import { Log } from "../utils/Log";

export function Middlewares(...middlewares: any[]): ClassDecorator {
  return (target: any) => {
    Log(`App is initialized with ${middlewares.length} global middlewares`);
    Reflect.defineMetadata("Middlewares", middlewares, target);
  };
}
