import { Log } from "../utils/Log";

export function Controllers(...controllers: any[]): ClassDecorator {
  return (target: any) => {
    Log(`App is initialized with ${controllers.length} controllers`);
    Reflect.defineMetadata("Controllers", controllers, target);
  };
}
