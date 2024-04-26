export function Param(paramName?: string, options?: any) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const metadataKey = `__routeParameters__${String(propertyKey)}`;

    const existingParameters =
      Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];

    existingParameters.push({
      paramName,
      parameterIndex,
      type: "param",
      options,
    });
    Reflect.defineMetadata(
      metadataKey,
      existingParameters,
      target,
      propertyKey
    );
  };
}
