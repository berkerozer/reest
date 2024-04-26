export const Middleware = (app: any) => {
  return function (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    // Eğer bir metoda uygulanıyorsa
    if (key && descriptor) {
      addMiddlewareToMethod(target, key, new app().use);
    } else if (typeof target === "function") {
      // Eğer bir sınıfa uygulanıyorsa, tüm metodlara middleware eklenir
      addMiddlewareToClass(target, app);
    }
  };
};

function addMiddlewareToMethod(
  target: any,
  key: string | symbol,
  middleware: Function
) {
  const routes = Reflect.getMetadata("routes", target.constructor);
  const route = routes.find((route: any) => route.methodName === key) || {
    methodName: key,
    middlewares: [],
  };

  if (!route.middlewares) {
    route.middlewares = [];
  }

  route.middlewares.push(middleware);

  Reflect.defineMetadata("routes", [...routes, route], target.constructor);
}

function addMiddlewareToClass(target: Function, app: any) {
  const methods = Object.getOwnPropertyNames(target.prototype).filter(
    (method) => method !== "constructor"
  );

  methods.forEach((methodName) => {
    addMiddlewareToMethod(target.prototype, methodName, new app().use);
  });
}
