import { Interceptor } from "../../types";

export function UseGlobalInterceptor(interceptor: {
  new (): Interceptor;
}): ClassDecorator {
  return (target: any) => {
    const currentInterceptors = Reflect.getMetadata(
      "GlobalInterceptors",
      target
    );

    if (currentInterceptors?.length > 0) {
      Reflect.defineMetadata(
        "GlobalInterceptors",
        [...currentInterceptors, interceptor],
        target
      );
    } else {
      Reflect.defineMetadata("GlobalInterceptors", [interceptor], target);
    }
  };
}
